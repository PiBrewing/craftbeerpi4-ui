import { Button, ButtonGroup, Divider, Grid, List, Paper, Typography, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemButton from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "@mui/styles";
import CachedIcon from "@mui/icons-material/Cached";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { default as React, useContext, useEffect, useState } from "react";
import { useCBPi } from "../../data";
import { fermenterapi } from "../../data/fermenterapi";
import ActorName from "../../util/ActorName";
import FermenterName from "../../util/FermenterName";
import FermenterControl from "../../util/FermenterControl";
import PropsEdit from "../../util/PropsEdit";
import SensorName from "../../util/SensorName";
import { DashboardContext, useDraggable, useModel } from "../DashboardContext";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
    },
  },
}));

const StepProps = ({ config, data }) => {
  if (!config) {
    return <></>;
  }

  return config.map((e, index) => {
    switch (e.type) {
      case "actor":
        return (
          <Grid item xs={12} md={6} key={index}>
            <Typography variant="caption" display="block" gutterBottom>
              {e.label}{" "}
            </Typography>
            <ActorName id={data[e.label]} />
          </Grid>
        );
      case "sensor":
        return (
          <Grid item xs={12} md={6} key={index}>
            <Typography variant="caption" display="block" gutterBottom>
              {e.label}
            </Typography>
            <SensorName id={data[e.label]} />
          </Grid>
        );
      case "fermenter":
        return (
          <Grid item xs={12} md={6} key={index}>
            <Typography variant="caption" display="block" gutterBottom>
              {e.label}{" "}
            </Typography>
            <FermenterName id={data[e.label]} />
          </Grid>
        );

      default:
        return (
          <Grid item xs={12} md={6} key={index}>
            <Typography variant="caption" display="block" gutterBottom>
              {e.label}{" "}
            </Typography>
            {data[e.label]}
          </Grid>
        );
    }
  });
};

const StepActionDialog = ({ action, config, open, onClose, onSubmit }) => {
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
        <Button onClick={() => onSubmit(props)} variant="contained" color="Primary" autoFocus>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StepActionButton = ({ item, action }) => {
  const [open, setOpen] = React.useState(false);

  const call_action = (id, action) => {
    if (action.parameters.length > 0) {
      setOpen(true);
    } else {
      fermenterapi.action(id, action.method, {});
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (props) => {
    setOpen(false);
    fermenterapi.action(item.id, action.method, props);
  };

  return (
    <>
      <Button startIcon={<PlayCircleFilledIcon />} variant="contained" color="primary" fullWidth onClick={() => call_action(item.id, action)}>
        {action.label}{" "}
      </Button>
      {action?.parameters ? <StepActionDialog action={action} open={open} onSubmit={handleSubmit} onClose={handleClose} /> : null}
    </>
  );
};

const StepActionList = ({ type, item }) => {
  return (
    <ButtonGroup fullWidth orientation="vertical">
      {type.actions.map((action) => (
        <StepActionButton item={item} action={action} />
      ))}
    </ButtonGroup>
  );
};

function StepDetailsDialog(props) {
  const { state } = useCBPi();
  const { onClose, selectedValue, open, item } = props;
  const [actions, setActions] = useState([]);
  const [type, setType] = React.useState({});
  const classes = useStyles();
  const handleClose = () => {
    onClose(selectedValue);
  };

  useEffect(() => {
    const t = state.stepTypesFermenter.find((e) => e.name === item.type);
    setType(t, {});
    setActions(t?.actions || []);
  }, [state.stepTypesFermenter]);

  return (
    <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogContent>
        <Paper className={classes.paper}>
          <Typography variant="h4" gutterBottom>
            {item.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Parameter
          </Typography>
          <Grid container spacing={3}>
            <StepProps config={type.properties} data={item.props} />
          </Grid>
        </Paper>
        <Divider />
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <StepActionList item={item} type={type} />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="secondary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const State = ({ state }) => {
  switch (state) {
    case "I":
      return <RadioButtonUncheckedIcon />;
    case "A":
      return <CachedIcon color="primary" />;
    case "E":
      return <ErrorIcon />;
    case "D":
      return <CheckCircleIcon color="primary" />;
    case "S":
      return <PauseCircleOutlineIcon />;
    default:
      return "";
  }
};

const StepItem = ({ size, item }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("emails");
  const draggable = useDraggable();
  
  const handleClickOpen = () => {
    if (draggable) {
      return;
    }
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const primaryprops = {
    fontSize: (size -3 )+"pt",
    "&:hover": {opacity: 0.7}
 };
  const secondaryprops = {
    fontSize: size+"pt",
    "&:hover": {opacity: 0.7}
 };

  return (
    <>
      <ListItemButton style={{opacity: 1}} disabled={!draggable} onClick={handleClickOpen}>
        <ListItemIcon>
          <State state={item.status} />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ sx: primaryprops }} primary={item.name} secondaryTypographyProps={{ style: secondaryprops }} secondary={item.state_text} />
      </ListItemButton>
      <StepDetailsDialog item={item} selectedValue={selectedValue} open={open} onClose={handleClose} />
    </>
  );
};

export const FermenterSteps = ({ id }) => {
  const { state: state2, actions } = useContext(DashboardContext);

  const model = useModel(id);
  const { state } = useCBPi();
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();
  const draggable = useDraggable()
  const [fermenterid, setFermenterID] = useState(model.props?.fermenter);
  const [brewname, setBrewName] = useState("");
  const fermenter = state.fermenter.find(e => e.id === fermenterid)


 
  useEffect(() => {
    
    const value = state.fermenter.find((item) => item.id === model.props.fermenter);
    setFermenterID(model.props.fermenter);
    if (value){
    setBrewName(value.brewname)};
  }, [model.props.fermenter, state.fermenter]);

  useEffect(() => {
    if (fermenterid && (fermenterid !==1)) {
      if (state.fermentersteps) {
        try {
          const step= state.fermentersteps.find(step => step.id === fermenterid).steps;
          setProfile(step)}
        catch{
          console.log("no steps")
        }
        };

    };
  }, [state.fermentersteps, fermenterid]);

  let inputStyle = { color: "#fff", width: `${model?.props?.width}px`,fontSize: `${model?.props?.namesize}pt`, backgroundColor: "#2c282e", padding: 5, borderRadius: 5 };

  if( draggable) {
    return <div className="box" style={{...inputStyle, display:"flex", justifyContent: "center", alignItems: "center"}}>
      <Typography variant="h6">Fermenter Steps</Typography>
    </div>
  }

  if (!brewname) {
    return (
      <Tooltip title={fermenter ? fermenter.name.concat(" Fermenter") : "No Fermenter selected"}>
      <div className="box" style={{...inputStyle, display:"flex", justifyContent: "center", alignItems: "center"}}>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate("/fermenterrecipes");
          }}
          startIcon={<MenuBookIcon />}
        >
          Please select a Recipe
        </Button>
        </div>
        </Tooltip>
      
    );
  }

  return (
    <div className="box" style={inputStyle}>
      <div style={{ marign: 20 }}>
        <div className="section_header">{brewname}</div>
        <FermenterControl fermenterid={fermenterid} disabled={state2.draggable} />
        <List component="nav" aria-label="main mailbox folders" style={{maxHeight: `${model?.props?.maxheight}px`, overflow: "auto"}}>
          {profile.map((row, index) => (
            <StepItem size={model.props.stepsize} item={row} key={index} />
          ))}
        </List>
      </div>
    </div>
  );
};

export default FermenterSteps;
