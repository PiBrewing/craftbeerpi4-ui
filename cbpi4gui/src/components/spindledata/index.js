import { Container, Divider, Grid, IconButton, Typography, Table, TableContainer, TableBody,TableCell,TableHead,TableRow } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { ToggleButton, Tooltip } from "@mui/material";
import { ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSensor } from "../data";
import DeleteDialog from "../util/DeleteDialog";
import { useNavigate , useParams} from "react-router-dom";
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { sqlapi } from "../data/sqlapi";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from '@mui/material/InputLabel';
import { letterSpacing } from "@mui/system";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CalculateIcon from '@mui/icons-material/Calculate';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const useStyles = makeStyles({
  table: {
      minWidth: 650,
  },
});

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


export const Spindledata = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { archive } = useParams();
  const { diagram } = useParams();
  const [archivelist, setArchivelist] = useState([]);
  const [currentarchive, setCurrentarchive] = useState("");
  const [diagramlist, setDiagramlist] = useState([]);
  const [currentdiagram, setCurrentdiagram] = useState([]);
  const [archiveheader, setArchiveheader] = useState([]);
  const [range_y1, setRange_y1] = useState([]);
  const [range_y2, setRange_y2] = useState([]);
  const [range_y3, setRange_y3] = useState([]);
  const [rid, setRID] = useState("");
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [ridFlag, setRIDFlag] = useState(false);
  const [range_x, setRange_x] = useState([0,1]);

const load = () => {
    setLoading(true);
    sqlapi.getarchiveheader(currentarchive, (data) => {
        setArchiveheader(data);
        sqlapi.getarchivevalues(data, (data) => {
            const temp = [];
            let range_1 = [];
            let range_2 = [];
            let range_3 = [];

            if (currentdiagram === '0') {
                range_1 = [0, 20]
                range_2 = [0, 40]
                temp.push({
                    x: data.time,
                    y: data.Servergravity,
                    name: "Gravity (Server Polynomial)",
                    type: "scatter",
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })

                temp.push({
                    x: data.time,
                    y: data.temperature,
                    name: "Temperature",
                    type: "scatter",
                    yaxis: 'y2',
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })
            }

            if (currentdiagram === '1') {
                range_1 = [0, 20]
                range_2 = [0, 40]
                temp.push({
                    x: data.time,
                    y: data.gravity,
                    name: "Gravity (iSpindle Polynomial)",
                    type: "scatter",
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })

                temp.push({
                    x: data.time,
                    y: data.temperature,
                    name: "Temperature",
                    type: "scatter",
                    yaxis: 'y2',
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })
            }

            if (currentdiagram === '2') {
                range_1 = [0, 80]
                range_2 = [0, 40]
                temp.push({
                    x: data.time,
                    y: data.angle,
                    name: "Angle",
                    type: "scatter",
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })

                temp.push({
                    x: data.time,
                    y: data.temperature,
                    name: "Temperature",
                    type: "scatter",
                    yaxis: 'y2',
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })
            }

            if (currentdiagram === '3') {
                range_1 = [0, 85]
                range_2 = [0, 42.5]
                range_3 = [0, 15]
                temp.push({
                    x: data.time,
                    y: data.attenuation,
                    name: "Attenuation",
                    type: "scatter",
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })

                temp.push({
                    x: data.time,
                    y: data.alcohol,
                    name: "ABV %",
                    type: "scatter",
                    yaxis: 'y2',
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })

                temp.push({
                    x: data.time,
                    y: data.temperature,
                    name: "Temperature",
                    type: "scatter",
                    yaxis: 'y2',
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })
            }

            if (currentdiagram === '4') {
                range_1 = [2, 5]
                range_2 = [-100, -20]
                temp.push({
                    x: data.time,
                    y: data.battery,
                    name: "Battery",
                    type: "scatter",
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })

                temp.push({
                    x: data.time,
                    y: data.rssi,
                    name: "RSSI",
                    yaxis: 'y2',
                    type: "scatter",
                    line: {
                        width: 3,
                        shape: 'spline'
                    }
                })
            }
            setData(temp);
            setRange_x([data.time[0], data.time[data.time.length - 1]]);
            setRange_y1(range_1);
            setRange_y2(range_2);
            setRange_y3(range_3);

        });
    })

    setLoading(false);

};

  useEffect(() => {
    sqlapi.getarchivelist((data) => {
      setArchivelist(data);
      setCurrentarchive(data[0].value);
      sqlapi.getarchiveheader(data[0].value, (data) => {  
        setArchiveheader(data);
      });
    });
  }, []);

  useEffect(() => {
    sqlapi.getdiagramlist((data) => {
      setDiagramlist(data);
      setCurrentdiagram(data[0].value);
    });
  }, []);

  useEffect(() => {
 //   setCurrentarchive(archive);
 //   setCurrentdiagram(diagram);
  }, [archive, diagram]);  

  useEffect(() => {
    setRIDFlag(archiveheader.RID_END);
  }, [archiveheader]);

  useEffect(() => {
    if (currentarchive === "") {
      return;
    }
    sqlapi.getarchiveheader(currentarchive, (data) => { 
      setArchiveheader(data);
      sqlapi.getarchivevalues(data, (data) => {  
        load();
     });
  })
}, [currentarchive, currentdiagram]);


  const ArchiveChange = (event) => {
    setCurrentarchive(event.target.value);
    navigate("/data/"+event.target.value+"/"+currentdiagram);
    };

  const DiagramChange = (event) => {
    setCurrentdiagram(event.target.value);
    if (currentarchive !== "") {
      navigate("/data/"+currentarchive+"/"+event.target.value);
    }      
      };
  

const delete_archive = () => {
  sqlapi.deletearchive(archiveheader.ArchiveID, (data) => {});
  navigate(0);
  };

  const remove_rid = () => {
    sqlapi.removeridflag(archiveheader.ArchiveID, (data) => {
    load();
        })
  };

  const transfercalibration = () => {
    //console.log(archiveheader.ArchiveID);
    //console.log(archiveheader.SpindleID);
    sqlapi.transfercalibration(archiveheader.SpindleID, archiveheader.ArchiveID, (data) => {
      load();
          }
    )
  };
          

const handleClickOpen = (data) => {
  setTitle("Set Archive End Date");
  setRID(Date.parse(data));
  setMessage("Do you want to set end of archive to " + data + "?");
  setOpen(true);
};

const no = () => {
  setOpen(false);
};

const yes = () => {
  sqlapi.addridflag(archiveheader.ArchiveID, rid, (data) => {
    load();
  })
  setOpen(false);
};

  return (
    <>
    <Container maxWidth="lg">
      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
          Spindle Data
          </Typography>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: 10, marginTop: 10 }} />
      <Tooltip title="Current Spindle Data">
      <IconButton aria-label="delete" size="small" onClick={() => { navigate("/currentdata") }} >
        <NewspaperIcon />
      </IconButton>
      </Tooltip>


      <Tooltip title="Calibrate">
      <IconButton aria-label="delete" size="small" onClick={() => { navigate("/calibrate") }} >
        <CalculateIcon/>
      </IconButton>
      </Tooltip>

      <Divider style={{ marginBottom: 10, marginTop: 10 }} />
      <Grid container spacing={3}>
        <Grid item xs="12">
        <TableContainer component={Paper}>
          <Table className={classes.table} dense={true} table size="medium" aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell style={{minWidth:370, maxWidth:370}}>
                  <InputLabel id="demo-simple-select-helper-label">Archive:</InputLabel>
                  <SelectBox options={archivelist} value={archive? archive : currentarchive} onChange={ArchiveChange} />
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Device:</InputLabel>
                  {archiveheader.Spindle_Name}
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Name:</InputLabel>
                  {archiveheader.Recipe}
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Start:</InputLabel>
                  {archiveheader.Start_date} 
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">End:</InputLabel>
                  {archiveheader.End_date}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{minWidth:370, maxWidth:370}}>
                  <InputLabel id="demo-simple-select-helper-label">Diagram:</InputLabel>
                  <SelectBox options={diagramlist} value={diagram? diagram : currentdiagram} onChange={DiagramChange} />
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Original Gravity:</InputLabel>
                  {archiveheader.Initial_Gravity} °P
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Final Gravity:</InputLabel>
                  {archiveheader.Final_Gravity} °P
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Attenuation:</InputLabel>
                  {archiveheader.Attenuation} %
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Alcohol:</InputLabel>
                  {archiveheader.Alcohol_by_volume} %
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" className="hidden-xs">
                  <InputLabel id="demo-simple-select-helper-label">Calibration (Server):</InputLabel>
                  {(currentdiagram==='0' || currentdiagram==='3')? archiveheader.Formula : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>


          <Tooltip  title="Refresh">
          <IconButton onClick={load}> 
            <AutorenewIcon className={loading ? "rotating-right" : "" }/>
          </IconButton>
          </Tooltip>

          <DeleteDialog
            title="Delete current Archive"
            tooltip="Delete Archive"
            message="Do you want to delete the current archive?"
            callback={delete_archive}
            />

            {ridFlag ? (          <DeleteDialog
            title="Delete Archive End Flag"
            tooltip="Remove Archive End Flag"
            message="Do you want to delete the current archive end flag?"
            icon="RID"
            callback={remove_rid}
            />) : ( 
              "")
            }
            <DeleteDialog
            title="Apply current spindle calibration to archive"
            tooltip="Apply current spindle calibration to archive"
            message = "Do you want to apply calibration to the current archive from spindle"
            icon="Calibrate"
            Spindle_Name={archiveheader.Spindle_Name}
            callback={transfercalibration}
            />

        </Grid>
        <Grid item xs="12">
        <Dialog open={open} onClose={no} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={no} color="secondary" autoFocus variant="contained">
            No
          </Button>
          <Button onClick={yes} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
          <Plot
            onClick={(e) => { handleClickOpen(e.points[0].data.x[e.points[0].pointNumber]);
                              }}
            data={data}
            config={{ displayModeBar: false }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
            layout={{
              title: {
                text: "",
                font: {
                  family: "Advent Pro",
                  size: 12,
                  color: "#fff",
                },
              },
			  uirevision:'true',
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              margin: {
                l: 80,
                r: 80,
                b: 50,
                t: 30,
                pad: 0,
              },
              legend: {
                x: 1,
                xanchor: "right",
                y: 1,
                font: {
                  family: "sans-serif",
                  size: 10,
                  color: "#fff",
                },
              },
              xaxis: {
                range: range_x,
                type: "date",
                showgrid: false,
                tickfont: {
                  size: 12,
                  color: "#fff",
                },
              },
              yaxis: {
                showgrid: true,
                tickformat: '.1f',
                tickfont: {
                  size: 12,
                  color: "#fff",
                },
                side: 'left',
                range: range_y1,
              },
              yaxis2: {
                showgrid: true,
                tickformat: '.1f',
                tickfont: {
                  size: 12,
                  color: "#fff",
                },
                overlaying: 'y',
                side: 'right',
                range: range_y2,
              },
              yaxis3: {
                showgrid: false,
                //position: 200,
                tickformat: '.1f',
                tickfont: {
                  size: 12,
                  color: "#fff",
                },
                //overlaying: 'y',
                side: 'right',
                range: range_y3,
              },
            }}

          />
        </Grid>
      </Grid>
      </Container>
    </>
  );
};
