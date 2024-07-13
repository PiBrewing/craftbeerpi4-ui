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


const PowerDialog = ({ onClose, actor, open }) => {
  const [value, setValue] = useState(actor?.power || 100);
  const [minval, setMinval] = useState(0);
  const [maxval, setMaxval] = useState(100);
  const [marks, setMarks] = useState(
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


  const {actions} = useCBPi()
  useEffect(()=>{
    setValue(actor?.power)
  },[])

  if (!actor) return "";

  const handleClose = () => {
    onClose();
  };

  const handleSet = () => {
    actions.set_actor_power(actor.id, value)
    onClose();
  };

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Power {actor.name} </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h2" component="h2" gutterBottom>
              {value}%
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

  

  return useMemo(() => {
    let cssStyle = { width: model.width + "px", height: model.height + "px" };
    let btnColor = actor?.state ? "primary" : "primary";
    let btnVariant = actor?.state ? "contained" : "outlined";
    
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

    const power = () => {
      if (model.props?.actor && actor) {
        if(actor.power >= 0 && actor.power <=100)
          return actor.power + " %";
      } 
      else {
        return "NV";
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

    if (action === "yes" && actor) {
      if (powerslider === "yes" && power()) 
      {
        return (
          <div style={cssStyle}>
            <ButtonGroup>
            <Tooltip title={actor ? actor.name : ""}>
              <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
              <div style={size()}> {name()} ({power()}) </div>
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
            <ButtonActionDialog open={open} onClose={handleClose} model={model} actor={actor} />
            <PowerDialog onClose={PowerSliderClose} actor={actor} open={powerOpen} />
          </div>
        );
      }
      else if ((powerslider === "no" || !powerslider) && power()) 
      {
        return (
          <div style={cssStyle}>
            <ButtonGroup>
            <Tooltip title={actor ? actor.name : ""}>
              <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
              <div style={size()}> {name()} ({power()}) </div>
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
    } else {
      if (powerslider === "yes" && power())
      {
        return (
          <div style={cssStyle}>
            <ButtonGroup>
            <Tooltip title={actor ? actor.name : ""}>
            <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
            <div style={size()}> {name()} ({power()}) </div>
            </Button>
            </Tooltip>
            <Tooltip title="Set Power">
            <Button disabled={draggable} onClick={PowerSliderOpen} color="primary" startIcon={<BoltIcon />} size="small" aria-label="select merge strategy" aria-haspopup="menu"></Button>
            </Tooltip>
            </ButtonGroup>
            <PowerDialog onClose={PowerSliderClose} actor={actor} open={powerOpen} />
          </div>
        );
      }
      else if ((powerslider === "no" || !powerslider) && power()) 
      {
        return (
          <div style={cssStyle}>
            <Tooltip title={actor ? actor.name : ""}>
            <Button disabled={draggable} onClick={toggle} fullWidth variant={btnVariant} color={btnColor}>
            <div style={size()}> {name()} ({power()}) </div>
            </Button>
            </Tooltip>
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
    }
  }, [model.props?.actor, model.props?.size, model.props?.action, powerslider, model.name, actor, actor?.power, id, open, powerOpen,draggable]);
};
