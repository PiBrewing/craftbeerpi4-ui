import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import CBPiWebSocket from "./websocket";
import { actorapi } from "./actorapi";
import { useEventCallback } from "@mui/material";
import { useAlert } from "../alert/AlertProvider";
import { kettleapi } from "./kettleapi";
import { fermenterapi } from "./fermenterapi";
import { sensorapi } from "./sensorapi";

export const CBPiContext = createContext({});

export const CBPiProvider = ({ children }) => {
  const [sensors, setSensors] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [sensorDataType, setSensorDataType] = useState({});
  const [sensorInRange, setSensorInRange] = useState({});
  const [config, setConfig] = useState({});
  const [actors, setActors] = useState([]);
  const [logic, setLogic] = useState([]);
  const [actorTypes, setActorTypes] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [kettle, setKettle] = useState([]);
  const [mashProfile, setMashProfile] = useState([]);
  const [FermenterProfile, setFermenterProfile] = useState([]);
  const [mashBasic, setMashBasic] = useState([]);
  const [stepTypes, setStepTypes] = useState([]);
  const [stepTypesFermenter, setStepTypesFermenter] = useState([]);
  const [auth, setAuth] = useState(null);
  const [plugins, setPlugins] = useState([]);
  const [temp, setTemp] = useState("");
  const [version, setVersion] = useState("---");
  const [spindledata, setSpindledata] = useState(false);
  const [guiversion, setGUIersion] = useState("---");
  const [codename, setCodename] = useState("---");
  const a = useAlert();
  const [notification, setNotifiaction] = useState("");
  const [allnotifications, setAllNotifiactions] = useState([]);
  const [fermenter, setFermenter] = useState([]);
  const [fermenterlogic, setFermenterLogic] = useState([]);
  const [fermentersteps, setFermenterSteps] = useState([]);
  const [connection, setConnection] = useState(false);
  const [bf_recipes,setBF_recipes] = useState([]);

  const onMessage = useCallback((data) => {
    //console.log("WS", data);
    switch (data.topic) {
      case "kettleupdate":
        setKettle(() => data.data);
        break;
      case "fermenterupdate":
        setFermenter(() => data.data);
        //console.log(data.data);
        break;
      case "fermenterstepupdate":
        setFermenterSteps(() => data.data);
        break;
      case "actorupdate":
        setActors(() => data.data);
        break;
      case "sensorstate":
        setSensorData((current) => ({ ...current, [data.id]: data.value }));
        setSensorDataType((current) => ({ ...current, [data.id]: data.datatype }));
        setSensorInRange((current) => ({ ...current, [data.id]: data.inrange }));
        break;
      case "step_update":
        setMashProfile(() => data.data);
        break;
      case "mash_profile_update":
        setMashProfile(() => data.data.steps);
        setMashBasic(data.data.basic);
        break;
      case "sensorupdate":
        setSensors(() => data.data);
        break;
      case "connection/success":
          setConnection(true);
          break;
      case "connection/lost":
          setConnection(false);
          break;
      case "notifiaction":
        a.show(data.id, data.title, data.message, data.type, data.action);
        break;
      case "notificationupdate":
          setAllNotifiactions(() => data.data);
          break;
      case "bfupdate":
          setBF_recipes(() => data.data);
          //console.log(data.data)
          break;
      default:
        break;
    }
  });

  useEffect(() => {
    setNotifiaction(null);
  }, [notification]);

  useEffect(() => {
    const ws = new CBPiWebSocket(onMessage, alert);
    ws.connect();

    axios.get("/system/").then((res) => {
      const data = res.data;
      console.log(data)
      setKettle(data.kettle.data);
      setFermenter(data.fermenter.data);
      setFermenterLogic(Object.values(data.fermenter.types));
      setFermenterSteps((data.fermentersteps));
      setSensors(data.sensor.data);
      setActors(data.actor.data);
      setLogic(Object.values(data.kettle.types));
      setActorTypes(Object.values(data.actor.types));
      setSensorTypes(Object.values(data.sensor.types));
      setMashProfile(data.step.steps);
      setFermenterProfile(data.fermenter.data);
      setMashBasic(data.step.basic);
      setConfig(data.config);
      setVersion(data.version);
      setSpindledata(data.spindledata);
      setGUIersion(data.guiversion);
      setCodename(data.codename);
      setStepTypes(Object.values(data.step.types));
      setStepTypesFermenter(Object.values(data.fermenter.steptypes));
      setAuth(true);
      setConnection(true);
      setAllNotifiactions(data.notifications);
      setBF_recipes(data.bf_recipes);
      });
  }, []);

  // Step API
  const get_step_by_id = (id) => mashProfile.find((item) => item.id === id);
  const add_kettle = (data, onSuccess = () => {}, onError = () => {}) => kettleapi.add(data, onSuccess, onError);
  const update_kettle = (id, data, onSuccess = () => {}, onError = () => {}) => kettleapi.save(id, data, onSuccess, onError);
  const delete_kettle = (id, onSuccess = () => {}, onError = () => {}) => kettleapi.remove(id, onSuccess, onError);
  const target_temp_kettle = useEventCallback((id, temp) => kettleapi.target_temp(id, temp), []);
  const toggle_logic = useEventCallback((id) => kettleapi.toggle(id), []);

  const get_fermentersteps_by_id = (fermenterid, id) => fermentersteps.find((item) => item.id === fermenterid);
  const add_fermenter = (data, onSuccess = () => {}, onError = () => {}) => fermenterapi.add(data, onSuccess, onError);
  const update_fermenter = (id, data, onSuccess = () => {}, onError = () => {}) => fermenterapi.save(id, data, onSuccess, onError);
  const delete_fermenter = (id, onSuccess = () => {}, onError = () => {}) => fermenterapi.remove(id, onSuccess, onError);
  const target_temp_fermenter = useEventCallback((id, temp) => fermenterapi.target_temp(id, temp), []);
  const target_pressure_fermenter = useEventCallback((id, pressure) => fermenterapi.target_pressure(id, pressure), []);
  const toggle_logic_fermenter = useEventCallback((id) => fermenterapi.toggle(id), []);

  const add_actor = (data, onSuccess = () => {}, onError = () => {}) => actorapi.add(data, onSuccess, onError);
  const update_actor = (id, data, onSuccess = () => {}, onError = () => {}) => actorapi.save(id, data, onSuccess, onError);
  const delete_actor = (id, onSuccess = () => {}, onError = () => {}) => actorapi.remove(id, onSuccess, onError);
  const get_actor_by_id = (id) => actors.find((item) => item.id === id);
  const set_actor_power = useEventCallback((id, power) => actorapi.set_power(id, power), []);

  const toggle_actor = useEventCallback((id) => {
    const actor = get_actor_by_id(id);
    if (!actor) return;
    if (actor.state === false) {
      actorapi.on(id, (data) => setActors((current_actors) => current_actors.map((item, index) => (item.id === id ? { ...item, state: true } : item))));
    } else {
      actorapi.off(id, (data) => setActors((current_actors) => current_actors.map((item, index) => (item.id === id ? { ...item, state: false } : item))));
    }
  }, []);

  const add_sensor = (data, onSuccess = () => {}, onError = () => {}) => sensorapi.add(data, onSuccess, onError);
  const update_sensor = (id, data, onSuccess = () => {}, onError = () => {}) => sensorapi.save(id, data, onSuccess, onError);
  const delete_sensor = (id, onSuccess = () => {}, onError = () => {}) => sensorapi.remove(id, onSuccess, onError);

  const get_sensor_by_id = (id) => sensors.find((item) => item.id === id);

  const value = {
    state: { sensors, version, guiversion, codename, actors, logic, kettle, fermenter, fermenterlogic, auth, plugins, temp, sensorData, sensorDataType, sensorInRange, spindledata,
             actorTypes, sensorTypes, config, mashProfile, fermentersteps, FermenterProfile, mashBasic, stepTypes, stepTypesFermenter, connection, allnotifications, bf_recipes },
    actions: {
      delete_kettle,
      add_kettle,
      target_temp_kettle,
      toggle_logic,
      update_kettle,
      delete_fermenter,
      add_fermenter,
      target_temp_fermenter,
      target_pressure_fermenter,
      toggle_logic_fermenter,
      update_fermenter,
      add_actor,
      update_actor,
      delete_actor,
      toggle_actor,
      get_actor_by_id,
      set_actor_power,
      add_sensor,
      update_sensor,
      delete_sensor,
      get_sensor_by_id,
      get_step_by_id,
      get_fermentersteps_by_id,
    },
  };

  return ( <>
  <CBPiContext.Provider value={value}>{children}</CBPiContext.Provider>
    </>
  );
};

export const useCBPi = () => {
  const { state, actions } = useContext(CBPiContext);
  const value = useMemo(() => {
    return {
      state,
      connection: state.connection,
      version: state.version,
      guiversion: state.guiversion,
      codename: state.codename,
      kettle: state.kettle,
      fermenter: state.fermenter,
      actor: state.actors,
      actorTypes: state.actorTypes,
      sensor: state.sensors,
      sensorTypes: state.sensorTypes,
      config: state.config,
      spindledata: state.spindledata,
      actions,
    };
  }, [state]);
  return value;
};

export const useSensor = (id = null) => {
  const { sensor } = useCBPi();
  const value = useMemo(() => {
    return id === null ? sensor : sensor.find((item) => item.id === id);
  }, [sensor, id]);
  return value;
};

export const useKettle = (id) => {
  const { kettle } = useCBPi();
  const value = useMemo(() => {
    return kettle.find((item) => item.id === id);
  }, [kettle, id,]);
  return value;
};

export const useFermenter = (id) => {
  const { fermenter } = useCBPi();
  const value = useMemo(() => {
    return fermenter.find((item) => item.id === id);
  }, [fermenter, id,]);
  return value;
};

export const useActor = (id = null) => {
  const { actor } = useCBPi();
  const value = useMemo(() => {
    return id === null ? actor : actor.find((item) => item.id === id);
  }, [actor, id]);
  return value;
};
export const useActorType = (name = null) => {
  const { actorTypes } = useCBPi();
  const value = useMemo(() => {
    return name === null ? actorTypes : actorTypes.find((item) => item.name === name);
  }, [actorTypes, name]);
  return value;
};

export const useSensorType = (name = null) => {
  const { sensorTypes } = useCBPi();
  const value = useMemo(() => {
    return name === null ? sensorTypes : sensorTypes.find((item) => item.name === name);
  }, [sensorTypes, name]);
  return value;
};


