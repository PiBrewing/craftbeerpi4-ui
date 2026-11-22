import { Slider, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import SpeedIcon from '@mui/icons-material/Speed';
import WhatshotIcon from "@mui/icons-material/Whatshot";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useCBPi, useFermenter } from "../../data";
import { useActor } from "../../data/index";
import { DashboardContext, useModel } from "../DashboardContext";
import { configapi } from "../../data/configapi";

const TargetTempDialog = ({ onClose, fermenter, open }) => {
  let TEMP_UNIT = "TEMP_UNIT";
  const [value, setValue] = useState(30);
  const [checkunit, setCheckUnit] = useState(false);
  const [minval, setMinval] = useState(-5);
  const [maxval, setMaxval] = useState(40);
  const [marks, setMarks] = useState(
    [
      {
        value: -5,
        label: "-5°",
      },
            {
        value: 10,
        label: "10°",
      },
      {
        value: 20,
        label: "20°",
      },
      {
        value: 40,
        label: "40°",
      },
    ]
  );

  const marksF = [
          {
      value: 20,
      label: "20°",
    },
    {
      value: 50,
      label: "50°",
    },
    {
      value: 70,
      label: "70°",
    },
    {
      value: 104,
      label: "104°",
    },
  ];

  const {actions} = useCBPi()
  useEffect(()=>{
    setValue(fermenter?.target_temp)
  },[fermenter?.target_temp])

  
  if (checkunit === false){
      configapi.getone(TEMP_UNIT, (data) => {
        if (data==="F"){
          setMinval(20);
          setMaxval(104);
          setMarks(marksF);
        }
        setCheckUnit(true);
        });
      };
    
  if (!fermenter) return "";

  const handleClose = () => {
    onClose();
  };

  const handleSet = () => {
    actions.target_temp_fermenter(fermenter.id, value)
    onClose();
  };

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Target Temp {fermenter.name} </DialogTitle>
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

const TargetPressureDialog = ({ onClose, fermenter, open }) => {
  let PRESSURE_UNIT = "PRESSURE_UNIT";
  const [unit, setUnit] = useState("kPa");
  const [value, setValue] = useState(50);
  const [checkunit, setCheckUnit] = useState(false);
  const [minval, setMinval] = useState(0);
  const [maxval, setMaxval] = useState(400);
  const [stepwidth, setStepwidth] = useState(1);
  const [marks, setMarks] = useState(
    [
      {
        value: 0,
        label: "0",
      },
            {
        value: 100,
        label: "100",
      },
      {
        value: 200,
        label: "200",
      },
      {
        value: 300,
        label: "300",
      },
      {
        value: 400,
        label: "400",
      },
    ]
  );

  const marksPSI = [
          {
      value: 0,
      label: "0",
    },
    {
      value: 25,
      label: "25",
    },
    {
      value: 50,
      label: "50",
    },
    {
      value: 75,
      label: "75",
    },

  ];

  const {actions} = useCBPi()
  useEffect(()=>{
    setValue(fermenter?.target_pressure)
  },[fermenter?.target_pressure])

  
  if (checkunit === false){
      configapi.getone(PRESSURE_UNIT, (data) => {
        if (data==="PSI"){
          setUnit(data);
          setMinval(0);
          setMaxval(75);
          setMarks(marksPSI);
          setStepwidth(0.5);
        }
        setCheckUnit(true);
        });
      };
    
  if (!fermenter) return "";

  const handleClose = () => {
    onClose();
  };

  const handleSet = () => {
    actions.target_pressure_fermenter(fermenter.id, value)
    onClose();
  };

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Target Pressure {fermenter.name} </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h2" component="h2" gutterBottom>
              {value} {unit}
            </Typography>
          </div>
          <Slider min={minval} max={maxval} marks={marks} step={stepwidth} value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
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

export const FermenterControl = ({ id }) => {
  const { state } = useContext(DashboardContext);
  const [open, setOpen] = React.useState(false);
  const [openp, setOpenp] = React.useState(false);
  const model = useModel(id);
  const cbpi = useCBPi();
  const fermenter = useFermenter(model.props?.fermenter);
  const heater = useActor(fermenter?.heater);
  const cooler = useActor(fermenter?.cooler);
  const valve = useActor(fermenter?.valve);
  const toggle = (id) => {
    cbpi.actions.toggle_actor(id);
  };
  const toggle_fermenter_logic = (id) => {
    cbpi.actions.toggle_logic_fermenter(id);
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
        <ButtonGroup size={size()} disabled={state.draggable || !model.props.fermenter} orientation={orientation} color="primary" aria-label="contained primary button group">
          {heater ? <Tooltip title={fermenter ? fermenter.name.concat(": Heater") : "Heater"} placement={placement}>
            <Button variant={heater?.state ? "contained" : "outlined"}  color="primary" startIcon={<WhatshotIcon />} onClick={() => toggle(fermenter?.heater)}></Button>
          </Tooltip> : ""}
          {cooler ? <Tooltip title={fermenter ? fermenter.name.concat(": Cooler") : "Cooler"} placement={placement}>
            <Button variant={cooler?.state ? "contained" : "outlined"}  color="primary" startIcon={<AcUnitIcon />} onClick={() => toggle(fermenter?.cooler)}></Button>
          </Tooltip> : ""}
          {fermenter?.type ? <Tooltip title={fermenter ? fermenter.name.concat(": Auto Mode") : "Auto Mode"} placement={placement}>
            <Button variant={fermenter?.state ? "contained" : "outlined"}  color="primary" startIcon={<DriveEtaIcon />} onClick={() => toggle_fermenter_logic(fermenter?.id)}></Button>
          </Tooltip> : ""}
          <Tooltip title={fermenter ? fermenter.name.concat(": Target Temperature") : "Target Temperatur"} placement={placement}>
            <Button variant="outlined"  color="primary" onClick={() => setOpen(true)} startIcon={<TrackChangesIcon />}></Button>
          </Tooltip>
          {valve ? <Tooltip title={fermenter ? fermenter.name.concat(": Set target pressure") : "Set target pressure"} placement={placement}>
            <Button variant="outlined" color="primary" onClick={() => setOpenp(true)} startIcon={<SpeedIcon />}></Button>
          </Tooltip> : ""}
        </ButtonGroup>
  
      <TargetTempDialog open={open} fermenter={fermenter} onClose={() => setOpen(false)} />
      <TargetPressureDialog open={openp} fermenter={fermenter} onClose={() => setOpenp(false)} />
      </>
    );
  }, [state.draggable, fermenter, model.props.orientation, model.props.size, cooler, heater, valve, open, openp]);
};
