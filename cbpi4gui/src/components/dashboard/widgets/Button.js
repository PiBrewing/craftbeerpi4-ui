import { Typography, Slider, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, List, ListItemText } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useMemo, useState, useEffect } from "react";
import { useActor, useActorType, useCBPi } from "../../data";
import { useDraggable, useModel } from "../DashboardContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { actorapi } from "../../data/actorapi";
import PropsEdit from "../../util/PropsEdit";
import { ListItemButton, Tooltip} from "@mui/material";
import BoltIcon from '@mui/icons-material/Bolt';
import LinearProgress from '@mui/material/LinearProgress';



const PowerDialog = ({ onClose, actor, open, type }) => {
  //console.log(type)
  const [powervalue, setPowerValue] = useState(actor?.power || 100);
  const [powerminval, setPowerMinval] = useState(0);
  const [powermaxval, setPowerMaxval] = useState(100);
  const [powermarks, setPowerMarks] = useState(
    [
      {
        value: 0,
        label: "0%",
      },
            {
        value: 25,
        label: "25%",
      },
      {
        value: 50,
        label: "50%",
      },
      {
        value: 75,
        label: "75%",
      },
      {
        value: 100,
        label: "100%",
      },
    ]
  );

  const [outputvalue, setOutputValue] = useState(actor?.output || 100);
  const [outputminval, setOutputMinval] = useState(0);
  const [outputmaxval, setOutputMaxval] = useState(actor?.maxoutput || 100);
  const [outputmarks, setOutputMarks] = useState(
    [
      {}
            ]
  );


  const {actions} = useCBPi()
  
  useEffect(()=>{
    setPowerValue(actor?.power)
  },[actor?.power])

  useEffect(()=>{
    setOutputMaxval(actor?.maxoutput)
  },[actor?.maxoutput])

  useEffect(()=>{
    setOutputMarks(
      [
        {
          value: 0,
          label: "0",
        },
        {
          value: Math.round(actor?.maxoutput*0.25),
          label: Math.round(actor?.maxoutput*0.25),
        },
        {
          value: Math.round(actor?.maxoutput/2),
          label: Math.round(actor?.maxoutput/2),
        },
        {
          value: Math.round(actor?.maxoutput*0.75),
          label: Math.round(actor?.maxoutput*0.75),
        },
        {
          value: actor?.maxoutput,
          label: actor?.maxoutput,
        },
              ]

    )
  },[actor?.maxoutput])

  useEffect(()=>{
    setOutputValue(actor?.output)
  },[actor?.output])
  
  if (!actor) return "";

  const handleClose = () => {
    onClose();
  };

  const PowerSet = () => {
    actions.set_actor_power(actor.id, powervalue)
    onClose();
  };

  const OutputSet = () => {
    //console.log(outputvalue)
    actions.set_actor_output(actor.id, outputvalue)
    onClose();
  };

  const PowerChange = (event, newValue) => {
    setPowerValue(newValue);
  };

  const OutputChange = (event, newValue) => {
    setOutputValue(newValue);
  };

  if (type === "Power"){
  return (
    <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Power {actor.name} </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h2" component="h2" gutterBottom>
              {powervalue}%
            </Typography>
          </div>
          <Slider min={powerminval} max={powermaxval} marks={powermarks} step={1} value={powervalue} onChange={PowerChange} aria-labelledby="continuous-slider" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button variant="contained" onClick={handleClose} color="secondary" autoFocus>
              Cancel
            </Button>
            <Button variant="contained" onClick={PowerSet} color="primary" autoFocus
              >
              Set
            </Button>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  )}
  if (type === "Output"){
    //console.log(actor?.name)
    //console.log(outputmaxval)
    //console.log(outputmarks)
    return (
      <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Set Output {actor.name} </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h2" component="h2" gutterBottom>
                {outputvalue}
              </Typography>
            </div>
            <Slider min={outputminval} max={outputmaxval} marks={outputmarks} step={1} value={outputvalue} onChange={OutputChange} aria-labelledby="continuous-slider" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Button variant="contained" onClick={handleClose} color="secondary" autoFocus>
                Cancel
              </Button>
              <Button variant="contained" onClick={OutputSet} color="primary" autoFocus
                >
                Set
              </Button>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    )
  }
};


const ButtonActionPropsDialog = ({ action = {}, config, open, onClose, onSubmit }) => {
  const [props, setProps] = useState({});

  const onChangeProps = (name, value) => {
    setProps({ ...props, [name]: value });
  };

  
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle id="simple-dialog-title">{action.label}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid container spacing={3}>
            <PropsEdit config={action.parameters} onChange={onChangeProps} props={props} />
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary" autoFocus>
          Close
        </Button>
        <Button onClick={() => onSubmit(props)} variant="contained" /*color="Primary"*/ autoFocus>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ActionButton = ({ action, actorid }) => {
  const [open, setOpen] = useState(false);
  const handle_action = (id, action) => {
    actorapi.action(id, action.method, {});
  };

  const handleClose = () => setOpen(false);
  const handle_submit = (props) => {
      actorapi.action(actorid, action.method, props);
      setOpen(false)          
  }


  if (action.parameters.length > 0) {
    return (
      <>
        <ListItemButton>
          <ListItemText primary={action.label} onClick={() => setOpen(true)} />
        </ListItemButton>
        <ButtonActionPropsDialog open={open} action={action} onSubmit={handle_submit} onClose={handleClose}/>
        </>
    );
  } else {
    return (
      <>
      <ListItemButton  onClick={() => handle_action(actorid, action)}>
        <ListItemText primary={action.label}   />
      </ListItemButton>
      </>
    );
  }
};

const ButtonActionDialog = ({ open, onClose, model, actor }) => {
  const type = useActorType(actor.type);
  const { actor: actorid } = model.props;
  return type? (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{model.name}</DialogTitle>
      <List>
        {type?.actions.map((action, index) => (
          <ActionButton actorid={actorid} action={action} key={index} />
        ))}
        <ListItemButton color="secondary">
          <ListItemText primary="Close" onClick={onClose} />
        </ListItemButton>
      </List>
    </Dialog>
  ) : ("");
};

export const DashboardButton = ({ id, width, height }) => {
  const cbpi = useCBPi();
  const model = useModel(id);
  const draggable = useDraggable();
  const actor = useActor(model.props?.actor);
  const { actor: actorid, action, powerslider} = model.props;
  const [open, setOpen] = useState(false);
  const [boom, setBoom] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);
  const [buttonvalue,setButtonvalue] = useState("N/V");
  
  return useMemo(() => {
    let cssStyle = { width: model.width + "px", height: model.height + "px" };
    let btnColor = actor?.state ? "primary" : "primary";
    let btnVariant = actor?.state ? "contained" : "outlined";
    let timedIconOff = (actor?.props.delay_type === "switch-off delay") ? true : false;
    
    const toggle = () => {
      if (!draggable && model.props?.actor) {
        cbpi.actions.toggle_actor(model.props?.actor);
      }
      setBoom(!boom)
    };

    const name = () => {
      if (model.props?.actor && actor) {
        return model.name;
      } else {
        return "Missing Config";
      }
    };

    const timedactor = () => {
      if (model.props?.actor && actor) {
            return actor.type.includes("TimedActor");
      }
      else {
          return false;
      }
    };

    const progress = () => {
      if (model.props?.actor && actor) {
        return 100 / Number(actor.props.delay_time) * actor.timer;
      } 
      else {
        return 100;
      }
    };

    const timer = () => {
      if (model.props?.actor && actor) {
        if (timedIconOff) {
          return actor.timer + " s";
        }
        else {
          return actor.timer + "/" + actor.props.delay_time + " s";
        }
      } 
      else {
        return "NV";
      }
    };

    const power = ({type}) => {  

      if (model.props?.actor && actor) {
        if(actor.power >= 0 && actor.power <=100)
          return actor.power + " %";
      } 
      else {
        return "NV";
      }
    };


    const output = ({type}) => {  

      if (model.props?.actor && actor) {

          return actor.output + " / " + actor.maxoutput;
      } 
      else {
        return "NV";
      }
    };


    const power_bar = () => {
      if (model.props?.actor && actor) {
        if(actor.power >= 0 && actor.power <=100)
          return actor.power;
      } 
      else {
        return 0;
      }
    };

    const size = () => {
      if (model.props?.size) {
        let css={ fontSize: model.props.size+"px"};
        return css;
      } else {
        let css={ fontSize: "12px" };
        return css;
      }
    };

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const PowerSliderClose = () => setPowerOpen(false);
    const PowerSliderOpen = () => setPowerOpen(true);
    
    if (!timedactor()) {
      if (powerslider === "Power" || (powerslider === "No")) {
        //console.log(powerslider)
        setButtonvalue(power(powerslider));
      } 
      else if (powerslider === "Output") {
        setButtonvalue(output(powerslider));
      }
      if (action === "yes" && actor) {
        if ((powerslider === "Power" || powerslider === "Output") && power(powerslider)) 
        {
          return (
            <div style={cssStyle}>
              <ButtonGroup>
              <Tooltip title={actor ? actor.name : ""}>
                <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
                <div style={size()}> {name()} ({buttonvalue}) </div>
                </Button>
                </Tooltip>
                <Tooltip title="Set Power">
                <Button disabled={draggable} onClick={PowerSliderOpen} color="primary" startIcon={<BoltIcon />} size="small" aria-label="select merge strategy" aria-haspopup="menu"></Button>
                </Tooltip>
                <Tooltip title="Actions">
                <Button disabled={draggable} onClick={handleOpen} color="primary" size="small" aria-label="select merge strategy" aria-haspopup="menu">
                  <MoreVertIcon />
                </Button>
                </Tooltip>
              </ButtonGroup>
              <LinearProgress variant="determinate" value={power_bar()} sx={{ '& .MuiLinearProgress-bar': {backgroundColor: '#00FF00'}, backgroundColor: '#008800'}} />
              <ButtonActionDialog open={open} onClose={handleClose} model={model} actor={actor} />
              <PowerDialog onClose={PowerSliderClose} actor={actor} open={powerOpen} type={powerslider}/>
            </div>
          );
        }
        else if (powerslider === "No" && power(powerslider)) 
        {
          return (
            <div style={cssStyle}>
              <ButtonGroup>
              <Tooltip title={actor ? actor.name : ""}>
                <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
                <div style={size()}> {name()} ({buttonvalue}) </div>
                </Button>
                </Tooltip>
                <Tooltip title="Actions">
                <Button disabled={draggable} onClick={handleOpen} color="primary" size="small" aria-label="select merge strategy" aria-haspopup="menu">
                  <MoreVertIcon />
                </Button>
                </Tooltip>
              </ButtonGroup>
              <LinearProgress variant="determinate" value={power_bar()} sx={{ '& .MuiLinearProgress-bar': {backgroundColor: '#00FF00'}, backgroundColor: '#008800'}} />
              <ButtonActionDialog open={open} onClose={handleClose} model={model} actor={actor} />
            </div>
          );
        }
        else {
          return (
            <div style={cssStyle}>
              <ButtonGroup>
              <Tooltip title={actor ? actor.name : ""}>
                <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
                <div style={size()}> {name()} </div>
                </Button>
                </Tooltip>
                <Tooltip title="Actions">
                <Button disabled={draggable} onClick={handleOpen} color="primary" size="small" aria-label="select merge strategy" aria-haspopup="menu">
                  <MoreVertIcon />
                </Button>
                </Tooltip>
              </ButtonGroup>
              <ButtonActionDialog open={open} onClose={handleClose} model={model} actor={actor} />
            </div>
          );
        }
      } 
      // Action === "No"
      else {
        if ((powerslider === "Power" || powerslider === "Output") && power(powerslider))
        {        
        return (
            <div style={cssStyle}>
              <ButtonGroup>
              <Tooltip title={actor ? actor.name : ""}>
              <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
              <div style={size()}> {name()} ({buttonvalue}) </div>
              </Button>
              </Tooltip>
              <Tooltip title="Set Power">
              <Button disabled={draggable} onClick={PowerSliderOpen} color="primary" startIcon={<BoltIcon />} size="small" aria-label="select merge strategy" aria-haspopup="menu"></Button>
              </Tooltip>
              </ButtonGroup>
              <LinearProgress variant="determinate" value={power_bar()} sx={{ '& .MuiLinearProgress-bar': {backgroundColor: '#00FF00'}, backgroundColor: '#008800'}} />
              <PowerDialog onClose={PowerSliderClose} actor={actor} open={powerOpen} type={powerslider}/>
            </div>
          );
        }
        else if ((powerslider === "No") && power(powerslider)) 
        {
          return (
            <div style={cssStyle}>
              <Tooltip title={actor ? actor.name : ""}>
              <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
              <div style={size()}> {name()} ({buttonvalue}) </div>
              </Button>
              </Tooltip>
              <LinearProgress variant="determinate" value={power_bar()} sx={{ '& .MuiLinearProgress-bar': {backgroundColor: '#00FF00'}, backgroundColor: '#008800'}} />
              </div>
          );
        }
        else{
          return (
          <div style={cssStyle}>
            <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
            <div style={size()}> {name()} </div>
            </Button>
          </div>
        )}
      }}
    else{
      return (
      <div style={cssStyle}>
        <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor} style={{borderRadius: '0px'}} >
        <div style={size()}> {name()} ({timer()}) </div>
        </Button>
        <LinearProgress variant="determinate" value={progress()} sx={{ '& .MuiLinearProgress-bar': {backgroundColor: '#00FF00'}, backgroundColor: '#008800'}} />
      </div>
    )}
  }, [model.props?.actor, model.props?.size, model.props?.action, powerslider, actor?.maxoutput, model.name, actor, buttonvalue, actor?.output, actor?.power, id, open, powerOpen,draggable]);
};
