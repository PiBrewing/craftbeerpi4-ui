import { Breadcrumbs, Container, Divider, Link, Paper, Typography, Table, TableContainer, TableBody,TableCell,TableHead,TableRow, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import { sqlapi } from "../data/sqlapi";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


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

const SpindleCalForm = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const { id } = useParams();
  const [calibration, setCalibration] = useState([]);
  const [currentCalibration, setCurrentCalibration] = useState("");
  const [currentspindle, setCurrentspindle] = useState({});
  const [calibrated, setCalibrated] = useState(true);
  const [const0, setConst0] = useState(0);
  const [const1, setConst1] = useState(0);
  const [const2, setConst2] = useState(0);
  const [const3, setConst3] = useState(0);

  useEffect(() => {
    sqlapi.getcalibration((data) => {
      setCalibration(data);
      setCurrentCalibration(data[0].value);
      setCurrentspindle(data[0]);
      setConst0(data[0].data.const0);
      setConst1(data[0].data.const1);
      setConst2(data[0].data.const2);
      setConst3(data[0].data.const3);      
      setCalibrated(data[0].data.calibrated);
    });
  }, []);

  const save = () => {

    const data = {
      calibrated: calibrated,
      const0: const0,
      const1: const1,
      const2: const2,
      const3: const3,
    };
    const spindleid = calibration.find((item) => item.value === currentCalibration).ID
    sqlapi.savecalibration(spindleid, data, () => {
      navigate("/data");
    });
  };


  const onchange0 = (e) => {
    const value = e.target.value
      setConst0(value)
  }

  const onchange1 = (e) => {
    const value = e.target.value
      setConst1(value)
  } 

  const onchange2 = (e) => {
    const value = e.target.value
      setConst2(value)
  }

  const onchange3 = (e) => {      
    const value = e.target.value
      setConst3(value)
  }
  

  const onChangeSpindle = (e) =>  {
    const value = e.target.value
    if (value) {
      setCurrentCalibration(value)
      setCurrentspindle(calibration.find((item) => item.value === value))
      setConst0(calibration.find((item) => item.value === value).data.const0)
      setConst1(calibration.find((item) => item.value === value).data.const1)
      setConst2(calibration.find((item) => item.value === value).data.const2)
      setConst3(calibration.find((item) => item.value === value).data.const3)
      setCalibrated(calibration.find((item) => item.value === value).data.calibrated)

    }
  }

  return (
    <>
    <Container maxWidth="lg">
      <Typography variant="h6" gutterBottom>
        Server based Spindle Calibration
      </Typography>
      
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          onClick={() => {
            navigate("/data");
          }}
        >
          Spindle
        </Link>
        <Typography color="textPrimary">{currentspindle.label}</Typography>

      </Breadcrumbs>

      <Divider />
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Table>
              <TableRow>
                <TableCell>
                <SelectBox label="Type" options={calibration} value={currentCalibration} onChange={onChangeSpindle} />
                </TableCell>
                <TableCell>
                {!calibrated ? <Tooltip title="Spindle not calibrated" arrow><WarningAmberIcon color="error" /></Tooltip> : ""}
                </TableCell>
              </TableRow>
            </Table>
          </Grid>


        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <TableRow>
                <TableCell align="left">
                  Const0
                </TableCell>
                <TableCell align="right">
                  <TextField label="const0" variant="standard" onChange={onchange0} value={const0} />
                </TableCell>
                </TableRow>
                <TableRow>
                <TableCell align="left">
                  Const1
                </TableCell>
                <TableCell align="right">
                <TextField label="const1" variant="standard" onChange={onchange1} value={const1} />
                </TableCell>
                </TableRow>
                <TableRow>
                <TableCell align="left">
                  Const2
                </TableCell>
                <TableCell align="right">
                <TextField label="const2" variant="standard" onChange={onchange2} value={const2} />
                </TableCell>
                </TableRow>
                <TableRow>
                <TableCell align="left">
                  Const3
                </TableCell>
                <TableCell align="right">
                <TextField label="const3" variant="standard" onChange={onchange3} value={const3} />
                </TableCell>
                </TableRow>
          </TableBody>
        </Table>

        </Grid>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              navigate("/data");
            }}
            className={classes.button}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              save();
            }}
            className={classes.button}
          >
            Save
          </Button>
        </div>
      </Paper>
      </Container>
    </>
  );
};

export default SpindleCalForm;
