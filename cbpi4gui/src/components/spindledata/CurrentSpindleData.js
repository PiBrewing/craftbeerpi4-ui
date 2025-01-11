import { IconButton, Breadcrumbs, Container, Divider, Link, Paper, Typography, Table, TableContainer, TableBody,TableCell,TableHead,TableRow, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import { sqlapi } from "../data/sqlapi";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InputLabel from '@mui/material/InputLabel';
import CheckIcon from '@mui/icons-material/Check';
import SetRecipeDialog from "./SetRecipeDialog";
import { withStyles, createStyles} from '@mui/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    maxWidth: 1200,
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const StyledTableCell = withStyles((theme) =>
  createStyles({
    head: {
      color: theme.palette.common.white,
      fontSize: 12,
      fontWeight: "bold",
    },
    body: {
      fontSize: 10,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const SelectBox = ({ options, value, onChange }) => {
  let emptyoptions = []
  return options ? (
    <>
      <Select style={{minWidth:370, maxWidth:370}} variant="standard" labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </>
  ) :
   (
    <>
      <Select style={{minWidth:370, maxWidth:370}} variant="standard" labelId="demo-simple-select-label" id="demo-simple-select" value={emptyoptions} onChange={onChange}>
        {emptyoptions.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

const CurrentSpindleData = () => {
  const navigate = useNavigate();
  const classes = useStyles();


  const [currentspindle, setCurrentspindle] = useState({});
  const [calibrated, setCalibrated] = useState(true);
  const [spindledata, setSpindledata] = useState([])
  const [days, setDays] = useState(7)
  const [const0, setConst0] = useState(0);
  const [const1, setConst1] = useState(0);
  const [const2, setConst2] = useState(0);
  const [const3, setConst3] = useState(0);

  useEffect(() => {
    sqlapi.getrecentdata(days , (data) => {
      setSpindledata(data);
      console.log(data)
      setCurrentspindle(data[0].value);
      setCalibrated(data[0].data.Calibrated)
      setConst0(data[0].data.Const0);
      setConst1(data[0].data.Const1);
      setConst2(data[0].data.Const2);
      setConst3(data[0].data.Const3); 
    });
  }, []);

  const load = () => {
    sqlapi.getrecentdata(days , (data) => {
      setSpindledata(data);
      console.log(data)
      setCurrentspindle(data[0].value);
      setCalibrated(data[0].data.Calibrated)
      setConst0(data[0].data.Const0);
      setConst1(data[0].data.Const1);
      setConst2(data[0].data.Const2);
      setConst3(data[0].data.Const3);
    });
  }

  const save = (id, spindlename="iSpindle000", recipeName="Beer", batchID="0000") => {

    console.log("Save Recipe for Spindle " + id + " with name " + recipeName + " and batch ID " + batchID)
    console.log(spindlename)
    const data = {
      calibrated: calibrated,
      const0: const0,
      const1: const1,
      const2: const2,
      const3: const3,
      RecipeName: recipeName,
      BatchID: batchID,
      Spindlename: spindlename
    };

    console.log(data)
    
    sqlapi.resetrecipe(id, data, () => {
    navigate(0); // reload page to show new data
    });
  };




  const onChangeSpindle = (e) =>  {
    const value = e.target.value
    if (value) {
      setCurrentspindle(value)
      console.log(spindledata.find((item) => item.value === value).data)
      //setCurrentspindle(calibration.find((item) => item.value === value))
      setConst0(spindledata.find((item) => item.value === value).data.Const0)
      setConst1(spindledata.find((item) => item.value === value).data.Const1)
      setConst2(spindledata.find((item) => item.value === value).data.Const2)
      setConst3(spindledata.find((item) => item.value === value).data.Const3)
      setCalibrated(spindledata.find((item) => item.value === value).data.Calibrated)

    }
  }

  const onChangeDays = (e) => {
    const value=e.target.value
    setDays(value)
    sqlapi.getrecentdata(value , (data) => {
      setSpindledata(data);
      setCurrentspindle(data[0].value);
    });

  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Recent Spindle Data
      </Typography>
      
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          onClick={() => {
            navigate("/data");
          }}
        >
          Back to Archive data
        </Link>
      </Breadcrumbs>

      <Divider />
      <Paper elevation={12}>
        <Grid spacing={3} >
          <Grid item xs={12} md={10}>
            <TableContainer component={Paper}>
            <Table>
              <TableRow>
                <TableCell>
                <InputLabel id="demo-simple-select-helper-label">Select Spindle for Recipe Start:</InputLabel>
                <SelectBox label="Type" options={spindledata} value={currentspindle} onChange={onChangeSpindle} />
                </TableCell>
                <TableCell>
                {!calibrated ? <Tooltip title="Spindle not calibrated" arrow><WarningAmberIcon color="error" /></Tooltip> : 
                <Tooltip title="Calibrated" arrow><CheckIcon color="primary" /></Tooltip>}
                </TableCell>

                <TableCell>
                <TextField label="Days" onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}} value={days} onChange={onChangeDays}   />
                </TableCell>
                <TableCell >
                  <InputLabel id="demo-simple-select-helper-label">Set Recipe Start:</InputLabel>
                  <SetRecipeDialog title="Set New Recipe for " spindle={spindledata.find((item) => item.value === currentspindle)} message="Do you want to Start a new recipe for this spindle?" callback={save} id={currentspindle} /> 
                </TableCell>
                <TableCell>
                <Tooltip  title="Refresh">
          <IconButton onClick={load}>
            <AutorenewIcon/>
          </IconButton>
          </Tooltip>
                </TableCell>
              </TableRow>
            </Table>
            </TableContainer>
          </Grid>

        <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Device</StyledTableCell>
              <StyledTableCell align="left">Date/Time</StyledTableCell>
              <StyledTableCell align="left">Batch ID</StyledTableCell>
              <StyledTableCell align="left">Recipe Name</StyledTableCell>
              <StyledTableCell align="left">Angle</StyledTableCell>
              <StyledTableCell align="left">Temperature</StyledTableCell>
              <StyledTableCell align="left">Initial Gravity</StyledTableCell>
              <StyledTableCell align="left">Current Gravity</StyledTableCell>
              <StyledTableCell align="left">Delta (last 12 hours)</StyledTableCell>
              <StyledTableCell align="left">Attenuation</StyledTableCell>
              <StyledTableCell align="left">Alcohol (ABV)</StyledTableCell>
              <StyledTableCell align="left">Battery</StyledTableCell>
               <StyledTableCell align="left">RSSI</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spindledata.map((item) => (
              <StyledTableRow key={item.value}>
                <StyledTableCell align="left">{item.label}</StyledTableCell>
                <StyledTableCell align="left">{item.data.unixtime}</StyledTableCell>
                <StyledTableCell align="left">{item.data.BatchID}</StyledTableCell>
                <StyledTableCell align="left">{item.data.recipe}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.angle).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.temperature).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.InitialGravity).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.Servergravity).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.Delta_Gravity).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.Attenuation).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.ABV).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{parseFloat(item.data.battery).toFixed(1)}</StyledTableCell>
                <StyledTableCell align="left">{item.data.rssi}</StyledTableCell>
              </StyledTableRow>
            ))}
                
          </TableBody>
        </Table>
        </TableContainer>
        </Grid>
        
        <Divider />
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              navigate("/data");
            }}
            className={classes.button}
          >
            Back
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default CurrentSpindleData;
