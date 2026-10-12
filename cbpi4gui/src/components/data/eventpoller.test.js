import axios from "axios";
import CBPiEventPoller from "./eventpoller";

jest.mock("axios", () => ({
  get: jest.fn(),
  interceptors: { response: { use: jest.fn(), eject: jest.fn() } },
}));

const answer = (data) => Promise.resolve({ data });

beforeEach(() => axios.get.mockReset());

test("a reset reloads everything on top of its events, then polls on", async () => {
  const order = [];
  const poller = new CBPiEventPoller(
    (event) => order.push(event.topic),
    () => { order.push("reload"); return Promise.resolve(); },
  );
  axios.get
    .mockReturnValueOnce(answer({ epoch: "e1", seq: 7, reset: true, events: [{ topic: "sensorstate", id: "s1", value: 20 }] }))
    .mockReturnValue(answer({}));
  await poller.poll();
  expect(order).toEqual(["connection/success", "sensorstate", "reload"]);
  expect(poller.epoch).toBe("e1");
  expect(poller.seq).toBe(7);
});

test("the next poll waits for the reload", async () => {
  let reloaded;
  const poller = new CBPiEventPoller(() => {}, () => new Promise((resolve) => { reloaded = resolve; }));
  axios.get
    .mockReturnValueOnce(answer({ epoch: "e1", seq: 7, reset: true, events: [] }))
    .mockReturnValue(answer({}));
  let done = false;
  const polling = poller.poll().then(() => { done = true; });
  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(done).toBe(false);
  expect(poller.seq).toBe(-1);
  reloaded();
  await polling;
  expect(poller.seq).toBe(7);
});

test("a failed reload keeps the position, so the next poll resets again", async () => {
  const poller = new CBPiEventPoller(() => {}, () => Promise.reject(new Error("502")));
  axios.get.mockReturnValueOnce(answer({ epoch: "e1", seq: 7, reset: true, events: [] }));
  await expect(poller.poll()).rejects.toThrow("502");
  expect(poller.epoch).toBe(null);
  expect(poller.seq).toBe(-1);
  axios.get.mockReturnValueOnce(answer({ epoch: "e1", seq: 8, reset: false, events: [] }));
  await poller.poll();
  expect(axios.get.mock.calls[1][1].params).toEqual({ epoch: undefined, since: -1, timeout: 25 });
});

test("normal answers apply their events and move on", async () => {
  const events = [];
  const onReset = jest.fn();
  const poller = new CBPiEventPoller((event) => events.push(event), onReset);
  poller.epoch = "e1";
  poller.seq = 7;
  axios.get.mockReturnValueOnce(answer({ epoch: "e1", seq: 9, reset: false, events: [{ topic: "actorupdate", data: [] }] }));
  await poller.poll();
  expect(onReset).not.toHaveBeenCalled();
  expect(events.map((e) => e.topic)).toEqual(["connection/success", "actorupdate"]);
  expect(poller.seq).toBe(9);
});
