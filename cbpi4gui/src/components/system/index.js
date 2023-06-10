import { Container, IconButton, Grid, Typography, Divider, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from '@mui/material/InputLabel';
import { systemapi } from "../data/systemapi"
import RestartDialog from "../util/RestartDialog";
import ShutdownDialog from "../util/ShutDownDialog"; // Correct include
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from '@mui/icons-material/Restore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ObsoleteDeleteDialog from "../util/ObsoleteDeleteDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const SelectBox = ({ options, value, onChange }) => {
  return (
    <>
      <Select variant="standard" labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};


const CBPiSystem = () => {
  const classes = useStyles();

  const hiddenFileInput = React.useRef(null);
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    let formData = new FormData();
    formData.append("File", fileUploaded);
    systemapi.restoreConfig(formData, ReloadPage());
  };

  const svghiddenFileInput = React.useRef(null);
  const svghandleChange = event => {
    const svgfileUploaded = event.target.files[0];
    let svgformData = new FormData();
    svgformData.append("File", svgfileUploaded);
    systemapi.uploadSVG(svgformData, ReloadPage());
  };

  const ReloadPage = () => {
    //console.log("Reload page");
    /*window.location.reload();*/
  };

  const [systeminfo, setSystemInfo] = useState([]);

  useEffect(() => {
    systemapi.getsysteminfo((data) => {
      setSystemInfo(data);
      //console.log(data['system']);
    });
  }, []);

  const shutdown = () => {
    systemapi.shutdown();
  };

  const restart = () => {
    systemapi.restart();
  };

  const backup = (event) => {
    systemapi.backupConfig();
  };

  const [logtime, setLogtime] = useState(1);
  const logtimelist = [{ 'value': 1, 'label': '1 h' },
  { 'value': 6, 'label': '6 h' },
  { 'value': 12, 'label': '12 h' },
  { 'value': 24, 'label': '24 h' },
  { 'value': 'b', 'label': 'last boot' }];

  const LogtimeChange = (event) => {
    setLogtime(event.target.value);
  };

  const downloadlog = (event) => {
    systemapi.downloadlog(logtime);
  };

  return (
    <Container maxWidth="lg">
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            System Settings 
          </Typography>
        </Grid>

        <Grid item></Grid>
      </Grid>
      <Divider style={{ marginBottom: 10, marginTop: 10 }} />

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>System restart / Shutdown</TableCell>
              <TableCell>

              </TableCell>
              <TableCell align="right">


                <Grid>
                  Restart:
                  <RestartDialog
                    title="Restart System"
                    message="Do you want to Restart the system"
                    callback={restart}
                  />
                  Shutdown:
                  <ShutdownDialog
                    title="Shutdown System"
                    message="Do you want to Shutdown the system"
                    callback={shutdown}
                  />

                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Backup Config</TableCell>
              <TableCell>

              </TableCell>
              <TableCell align="right">


                <Grid>
                  Backup:
                  <IconButton onClick={backup}>
                    <SaveIcon />
                  </IconButton>

                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Remove Obsolete Config Parameters</TableCell>
              <TableCell>

              </TableCell>
              <TableCell align="right">


                <Grid>
                  Remove:
                  <ObsoleteDeleteDialog/>

                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Restore Config (Max: 5 Mb). (Please restart system afterwards)</TableCell>
              <TableCell>

              </TableCell>
              <TableCell align="right">


                <Grid>
                  Restore:
                  <input accept=".zip" ref={hiddenFileInput} className={classes.input} id="icon-button-file" type="file" hidden onChange={handleChange} />
                  <label htmlFor="icon-button-file">
                    <IconButton className={classes.button} component="span">
                      <RestoreIcon />
                    </IconButton>
                  </label>


                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Download log (only for cbpi running as systemctl service)</TableCell>
              <TableCell>

              </TableCell>
              <TableCell>
                  <InputLabel id="demo-simple-select-helper-label">Logtime length for download</InputLabel>
                  <SelectBox options={logtimelist} value={logtime} onChange={LogtimeChange} />
                </TableCell>
              <TableCell align="right">


                <Grid>
                  Download:
                  <IconButton onClick={downloadlog}>
                    <SaveIcon />
                  </IconButton>

                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Dashboard functions 
          </Typography>
        </Grid>

        <Grid item></Grid>
      </Grid>
      <Divider style={{ marginBottom: 10, marginTop: 10 }} />

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Upload SVG file to widgets folder (Max: 5 Mb)</TableCell>
              <TableCell>

              </TableCell>
              <TableCell align="right">


                <Grid>
                  Upload:
                  <input accept="image/svg+xml" ref={svghiddenFileInput} className={classes.input} id="icon-button-svgfile" type="file" hidden onChange={svghandleChange} />
                  <label htmlFor="icon-button-svgfile">
                    <IconButton className={classes.button} component="span">
                      <CloudUploadIcon />
                    </IconButton>
                  </label>


                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>      

      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            System Information
          </Typography>
        </Grid>

        <Grid item></Grid>
      </Grid>

      <Divider style={{ marginBottom: 10, marginTop: 10 }} />

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell style={{ width: 30 }} align="left">Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableRow>
            <TableCell>Operating System</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['system']}</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPU Count</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['cpucount']}</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPU Load</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['cpuload']}</TableCell>
            <TableCell align="left">%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPU Frequency</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['cpufreq']}</TableCell>
            <TableCell align="left">Mhz</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>System Temp</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['temp']}</TableCell>
            <TableCell align="left">{systeminfo['temp_unit']}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Memory</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['totalmem']}</TableCell>
            <TableCell align="left">Mb</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Available Memory</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['availmem']}</TableCell>
            <TableCell align="left">Mb</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Used Memory</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['mempercent']}</TableCell>
            <TableCell align="left">%</TableCell>
          </TableRow>
        <TableRow>
            <TableCell>Eth0 IP Address</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['eth0']}{" @ "}{systeminfo['eth0speed']}</TableCell>
            <TableCell align="left">Mbit</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Wlan0 IP Address</TableCell>
            <TableCell></TableCell>
            <TableCell align="right">{systeminfo['wlan0']}{" @ "}{systeminfo['wlan0speed']}</TableCell>
            <TableCell align="left">Mbit</TableCell>
          </TableRow>
        </Table>
      </TableContainer>

    </div>
    </Container>
  );
};

export default CBPiSystem;
