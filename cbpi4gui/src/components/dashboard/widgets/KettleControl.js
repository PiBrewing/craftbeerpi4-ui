import { Slider, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CachedIcon from "@mui/icons-material/Cached";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useCBPi, useKettle } from "../../data";
import { useActor } from "../../data/index";
import { DashboardContext, useModel } from "../DashboardContext";
import { configapi } from "../../data/configapi";


const TargetTempDialog = ({ onClose, kettle, open }) => {
  let TEMP_UNIT = "TEMP_UNIT";
  const [value, setValue] = useState(30);
  const [checkunit, setCheckUnit] = useState(false);
  const [minval, setMinval] = useState(0);
  const [maxval, setMaxval] = useState(100);
  const [marks, setMarks] = useState(
    [
      {
        value: 0,
        label: "0°",
      },
            {
        value: 20,
        label: "20°",
      },
      {
        value: 50,
        label: "50°",
      },
      {
        value: 100,
        label: "100°",
      },
    ]
  );

  const marksF = [
          {
      value: 32,
      label: "32°",
    },
    {
      value: 50,
      label: "50°",
    },
    {
      value: 100,
      label: "100°",
    },
    {
      value: 150,
      label: "150°",
    },
    {
      value: 212,
      label: "212°",
    },
  ];

  const {actions} = useCBPi()
  useEffect(()=>{
    setValue(kettle?.target_temp)
  },[])

  
  if (checkunit === false){
      configapi.getone(TEMP_UNIT, (data) => {
        if (data==="F"){
          setMinval(32);
          setMaxval(212);
          setMarks(marksF);
        }
        setCheckUnit(true);
        });
      };
    
  if (!kettle) return "";

  const handleClose = () => {
    onClose();
  };

  const handleSet = () => {
    actions.target_temp_kettle(kettle.id, value)
    onClose();
  };

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Target Temp {kettle.name} </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h2" component="h2" gutterBottom>
              {value}°
            </Typography>
          </div>
          <Slider min={minval} max={maxval} marks={marks} step={1} value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button variant="contained" onClick={handleClose} color="secondary" autoFocus>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSet} color="primary" autoFocus
              >
              Set
            </Button>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export const KettleControl = ({ id }) => {
  const { state } = useContext(DashboardContext);
  const [open, setOpen] = React.useState(false);
  const model = useModel(id);
  const cbpi = useCBPi();
  const kettle = useKettle(model.props?.kettle);
  const heater = useActor(kettle?.heater);
  const agitator = useActor(kettle?.agitator);
  const toggle = (id) => {
    cbpi.actions.toggle_actor(id);
  };
  const toggle_kettle_logic = (id) => {
    cbpi.actions.toggle_logic(id);
  };

    return useMemo(() => {
    const orientation = model?.props?.orientation === "horizontal" ? "horizontal" : "vertical";
    const size = () => {
      if (model.props.size === "large") {
        return "large"
      }
      else if (model.props.size === "small") {
        return "small"
      }
      else { 
        return "medium"
      }
    };
    const placement = orientation === "vertical" ? "right" : "bottom"; 
    
    //console.log(kettle?.state, heater?.state  )
    return (
      <>
        <ButtonGroup size={size()} disabled={state.draggable || !model.props.kettle} orientation={orientation} color="primary" aria-label="contained primary button group">
           {heater ? <Tooltip title={kettle ? kettle.name.concat(": Heater") : "Heater"} placement={placement}>
            <Button variant={heater?.state ? "contained" : "outlined"}  color="primary" startIcon={<WhatshotIcon />} onClick={() => toggle(kettle?.heater)}></Button>
            </Tooltip> : ""}
          {agitator ? <Tooltip title={kettle ? kettle.name.concat(": Agitator") : "Agitator"} placement={placement}>
            <Button variant={agitator?.state ? "contained" : "outlined"}  color="primary" startIcon={<CachedIcon />} onClick={() => toggle(kettle?.agitator)}></Button>
           </Tooltip> : ""}
          {kettle?.type ? <Tooltip title={kettle ? kettle.name.concat(": Auto mode") : "Auto Mode"} placement={placement}>
            <Button variant={kettle?.state ? "contained" : "outlined"}  color="primary" startIcon={<DriveEtaIcon />} onClick={() => toggle_kettle_logic(kettle?.id)}></Button>
           </Tooltip> : ""}
          <Tooltip title={kettle ? kettle.name.concat(": Target temperature") : "Target Temperature"} placement={placement}>
            <Button variant="outlined"  color="primary" onClick={() => setOpen(true)} startIcon={<TrackChangesIcon />}></Button>
          </Tooltip>  
        </ButtonGroup>
        
      <TargetTempDialog open={open} kettle={kettle} onClose={() => setOpen(false)} />
      </>
    );
  }, [state.draggable, kettle, model.props.orientation, model.props.size, agitator, heater, open]);
};
