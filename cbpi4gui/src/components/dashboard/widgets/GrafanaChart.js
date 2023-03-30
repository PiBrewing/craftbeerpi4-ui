import { ClickAwayListener, Dialog, DialogTitle, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Paper, Popper } from "@mui/material";
import Button from "@mui/material/Button";
import { TextField, DialogActions, DialogContent, Stack, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useRef, useState } from "react";
import { useDraggable, useModel } from "../DashboardContext";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from "@mui/icons-material/Delete";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { pink } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#00FF00"
    },
    secondary: pink,
  }
});

const SetRangeDialog = ({ open, onClose, onSubmit }) => {
  const [fromTime, setFromTime] = useState("now-12h");
  const [toTime, setToTime] = useState(Date.now());
  const [checked, setChecked] = useState(true);

    
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
    <ThemeProvider theme={theme}>
      <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">set Range</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DateTimePicker
                label="start datetime"
                maxDateTime={Date.now()}
                ampm={false}
                value={fromTime}
                onChange={(newValue) => {
                  setFromTime(newValue);
                }}
                renderInput={(params) => <TextField variant="standard" {...params} sx={{ '& .MuiInputLabel-root': {marginTop: '2px'}, }} />}
              />
              <DateTimePicker
                label="end datetime"
                maxDateTime={Date.now()}
                ampm={false}
                disabled={checked}
                value={toTime}
                onChange={(newValue) => {
                  setToTime(newValue);
                }}
                renderInput={(params) => <TextField variant="standard" {...params} sx={{ '& .MuiInputLabel-root': {marginTop: '2px'}, }} />}
              />
              <FormGroup>
                <FormControlLabel 
                  control={        
                    <Checkbox
                      checked={checked}
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  } 
                  label="autom. time update" />
              </FormGroup>
            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary" autoFocus>
            Close
          </Button>
          <Button onClick={() => onSubmit({fromT: Date.parse(fromTime), toT: Date.parse(toTime), box: checked})} variant="contained" /*color="Primary"*/ autoFocus>
            Submit
          </Button>
      </DialogActions>
      </Dialog>
      </ThemeProvider>
    </div>
  );
}


const GrafanaChart = ({ id }) => {
  const model = useModel(id);
  const draggable = useDraggable();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const anchorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const timeF = model.props?.timeframe;
  const [fromTime, setFromTime] = useState( timeF || "now-12h");
  const [toTime, setToTime] = useState("now");


  useEffect(() => {
    if (model.props.timeframe?.substr(0,3) !== "now") {
      try {
      setFromTime(Date.parse(model.props.timeframe));
    }
      catch{
        setFromTime("now-12h");
    }
    }
    
    load_data();
  }, [model?.props?.url, model.props?.refresh, model.props?.timeframe]);

  const update = () => {
    load_data();
    setOpen(false);
  }

  const load_data = () => {
    if (model?.props?.url) {
      setLoading(true);
      //console.log(toTime)
      //console.log(fromTime)
      if(toTime === "now"){
        setCounter(counter => counter + 1);
      }
      setLoading(false);
    }
  }
  
  const handleDialogClose = () => {
    setOpen(false);
    setOpenDialog(false);
  }
  
  const handle_submit = (props) => {
    setOpen(false);
    setFromTime(props.fromT);
    if(props.box==="true"){
      setToTime("now");
    }
    else {
      setToTime(props.toT);
    }
    setOpenDialog(false);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const clear_data = () => {
    setFromTime(Date.now());
    setToTime("now");
    setCounter(counter => counter + 1);
    setOpen(false);
  }

  if (draggable === true) {
    let css_style2 = {
      display: "flex",
      flexDirection: "column",
      fontSize: "20px",
      alignItems: "center",
      justifyContent: "center",
      width: `${model?.props?.width}px`,
      height: `${model?.props?.height}px`,
    };
    return (
      <div className="box" style={css_style2}>
        <div>Chart {model.name}</div>
        <div>{!model?.props?.url ? "Missing Config" : ""}</div>
      </div>
    );
  }

  if (!model?.props?.url) {
    return <div>Config Missing</div>;
  }

  return (
    <div className="box">
      {}
      <iframe key={counter} src={model?.props?.url+"?orgId=1&from="+fromTime+"&to="+toTime+"&panelId="+model?.props?.panelID+"&refresh="+(model.props?.refresh || "10s")} width={model?.props?.width} height={model?.props?.height} frameborder="0"></iframe>
      <IconButton  ref={anchorRef} onClick={()=>setOpen(true)} size="small" variant="contained" style={{ position: "absolute", top: 5, right: 10 }}>
        <MoreVertIcon />
      </IconButton>
      { loading ? <RotateLeftIcon fontSize="small" style={{ position: "absolute", top: 5, left: 10 }} />: ""}

      <Popper  open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>

      <ClickAwayListener onClickAway={handleClose}>
      <Paper>
      <List>
        <ListItemButton color="secondary" onClick={() => setOpenDialog(true)} >
          <ListItemIcon onClick={() => setOpenDialog(true)}>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary="set Range" />
        </ListItemButton>
        <SetRangeDialog open={openDialog} onSubmit={handle_submit} onClose={handleDialogClose}/>
        
        <ListItemButton color="secondary" onClick={update} >
          <ListItemIcon onClick={update}>
            <AutorenewIcon />
          </ListItemIcon>
          <ListItemText primary="Update Chart" />
        </ListItemButton>
        
        <ListItemButton color="secondary" onClick={clear_data} >
          <ListItemIcon onClick={clear_data}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Clear Chart" />
        </ListItemButton>
      </List>
      </Paper>
      </ClickAwayListener>
      </Popper>
      
    </div>
  );
};

export default GrafanaChart;
