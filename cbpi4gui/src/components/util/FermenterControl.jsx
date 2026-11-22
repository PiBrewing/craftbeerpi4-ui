import { Button, ButtonGroup, Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import StopIcon from "@mui/icons-material/Stop";
import { default as React, useEffect, useState } from "react";
import { useCBPi } from "../data";
import { fermenterapi } from "../data/fermenterapi";
import SkipNextIcon from '@mui/icons-material/SkipNext';


const FermenterControl = ({fermenterid=null, disabled=false}) => {
  const { state } = useCBPi();
  const [stop, setStop] = useState(null);
  const [reset, setReset] = useState(null);
  const [start, setStart] = useState(null);
  const [next, setNext] = useState(null);
  const [steps, setSteps] = useState([]);
  const fermenter = state.fermenter.find(e => e.id === fermenterid)
  
  useEffect(() => {
  
    if ((fermenterid) && (state.fermentersteps.length !== 0 )) {  
      const step= state.fermentersteps.find(step => step.id === fermenterid).steps;
      setSteps(step)};
   }, [state.fermentersteps, fermenterid]);

  useEffect(() => {
    if (steps.filter((item) => item.status === "D").length === steps.length) {
      setStop(false);
      setReset(true);
      setStart(false);
      setNext(false);
      return;
    }
    if (steps.filter((item) => item.status === "I").length === steps.length) {
      setStop(false);
      setReset(false);
      setStart(true);
      setNext(false);
      return;
    }
    if (steps.find((item) => item.status === "A")) {
      setStop(true);
      setReset(false);
      setStart(false);
      setNext(true);
    } else {
      setStop(false);
      setReset(true);
      setStart(true);
      setNext(true);
    }
  }, [steps, fermenterid]);

  if( steps.length === 0) {
    return <></>
  }
  
  return (
    <>
    <ButtonGroup disabled={disabled} fullWidth>
      {start ? (
        <Tooltip title={fermenter ? fermenter.name.concat(": Start step") : "Start Step"}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            fermenterapi.startstep(fermenterid);
          }}
          startIcon={<PlayCircleOutlineIcon />}
        >
          
        </Button>
        </Tooltip>
      ) : null}

      {next ? (
        <Tooltip title={fermenter ? fermenter.name.concat(": Next step") : "Next step"}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            fermenterapi.nextstep(fermenterid);
          }}
          startIcon={<SkipNextIcon />}
        >
          
        </Button>
        </Tooltip>
      ) : null}

      {stop ? (
        <Tooltip title={fermenter ? fermenter.name.concat(": Stop") : "Stop"}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<StopIcon />}
          onClick={() => {
            fermenterapi.stopstep(fermenterid);
          }}
        >
          
        </Button>
        </Tooltip>
      ) : null}

      {reset ? (
        <Tooltip title={fermenter ? fermenter.name.concat(": Reset") : "Reset"}>
        <Button startIcon={<RotateLeftIcon />} variant="contained" color="secondary" onClick={() => fermenterapi.reset(fermenterid)}>
          
        </Button>
        </Tooltip>
      ) : null}
      </ButtonGroup>
    </>
  );
};

export default FermenterControl;
