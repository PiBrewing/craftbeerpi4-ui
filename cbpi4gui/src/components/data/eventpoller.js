import axios from "axios";

// Server push over plain HTTP long-polling (GET /events), no websocket:
// works through any reverse proxy, and a cut connection only costs one request.
const POLL_TIMEOUT = 25; // seconds the server may hold a request
const RETRY_DELAYS = [1000, 2000, 5000, 10000];
// min time between two polls: events arriving meanwhile come in one answer
// instead of one request per sensor reading. A user action (POST/PUT/DELETE)
// cuts this wait short, so its result shows up at once.
const MIN_INTERVAL = 1000;

class CBPiEventPoller {

    constructor(onMessageCallback, onReset = () => {}) {
        this.onMessageCallback = onMessageCallback;
        this.onReset = onReset;
        this.epoch = null;
        this.seq = -1;
        this.online = null;
        this.failures = 0;
        this.running = false;
        this.controller = null;
        this.pause = null;
        this.interceptor = null;
    }

    // wait that wake() can cut short
    sleep(ms) {
        return new Promise((resolve) => {
            const timer = setTimeout(() => this.wake(), ms);
            this.pause = () => {
                clearTimeout(timer);
                resolve();
            };
        });
    }

    wake() {
        const pause = this.pause;
        this.pause = null;
        if (pause) pause();
    }

    connection_lost() {
        if (this.online === false) return;
        this.online = false;
        this.onMessageCallback({ topic: 'connection/lost' });
        this.onMessageCallback({ topic: 'notifiaction', id: '1', title: 'Connection to Server', message: 'Cbpi server seems to be down', type: 'error', action: [] });
    }

    connection_ok() {
        if (this.online === true) return;
        const reconnected = this.online === false;
        this.online = true;
        this.onMessageCallback({ topic: 'connection/success' });
        if (reconnected) {
            this.onMessageCallback({ topic: 'notifiaction', id: '2', title: 'Connection to Server', message: 'Established connection to Cbpi server', type: 'success', action: [] });
        }
    }

    async poll() {
        this.controller = new AbortController();
        const res = await axios.get("/events", {
            params: { epoch: this.epoch ?? undefined, since: this.seq, timeout: POLL_TIMEOUT },
            timeout: (POLL_TIMEOUT + 15) * 1000,
            signal: this.controller.signal,
        });
        const data = res.data;
        this.connection_ok();
        this.failures = 0;
        if (data.reset) {
            // first poll, server restart or too far behind: reload everything
            this.onReset();
            axios.get("/actor/ws_update");
        }
        this.epoch = data.epoch;
        this.seq = data.seq;
        data.events.forEach((event) => this.onMessageCallback(event));
    }

    async loop() {
        while (this.running) {
            const started = Date.now();
            try {
                await this.poll();
                const wait = MIN_INTERVAL - (Date.now() - started);
                if (wait > 0) await this.sleep(wait);
            } catch (e) {
                if (!this.running) break;
                this.connection_lost();
                const delay = RETRY_DELAYS[Math.min(this.failures, RETRY_DELAYS.length - 1)];
                this.failures += 1;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    connect() {
        if (this.running) return;
        this.running = true;
        this.interceptor = axios.interceptors.response.use((response) => {
            if (response.config.method !== "get") this.wake();
            return response;
        });
        this.loop();
    }

    close() {
        this.running = false;
        if (this.interceptor !== null) axios.interceptors.response.eject(this.interceptor);
        this.interceptor = null;
        this.wake();
        if (this.controller) this.controller.abort();
    }
}

export default CBPiEventPoller
