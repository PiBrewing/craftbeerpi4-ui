import { Container, Divider, Grid, IconButton, Typography, Table, TableContainer, TableBody,TableCell,TableHead,TableRow } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { ToggleButton, Tooltip } from "@mui/material";
import { ToggleButtonGroup } from '@mui/material';
import { useState } from "react";
import Plot from "react-plotly.js";
import { useSensor } from "../data";
import { logapi } from "../data/logapi";
import DeleteDialog from "../util/DeleteDialog";
import { useNavigate , useParams} from "react-router-dom";
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
  table: {
      minWidth: 650,
  },
});

export const Spindledata = () => {
  const navigate = useNavigate();
  const sensors = useSensor();
  const [formats, setFormats] = useState(() => []);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };
  const { fermentid } = useParams();
  const { diagram } = useParams();
  

  const classes = useStyles();

  const load = () => {
	setLoading(true) ;
    logapi.get2(formats, (d) => {
      const temp = [];
      
      for (const [key, value] of Object.entries(d)) {
        const senosr_config = sensors.find((item) => item.id === key);

        temp.push({
          x: value.time,
          y: value.value,
          name: senosr_config.name,
          type: "scatter",
          line: {
            width: 2,
			shape: 'spline'
          },
        });

        /*
[
            */
        //console.log(`${key}: ${value}`);
      }
	  setLoading(false);
      setData(temp);
    });
  };
const clear_logs = () => {
  formats.map(format =>(
    logapi.clear(format)
  ));
  navigate(0);
  };

  const clear_all_logs = () => {
    sensors.map(sensor => (
      logapi.clear(sensor.id)
    ));
    navigate(0);
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
      <Grid container spacing={3}>
        <Grid item xs="12">
        <TableContainer component={Paper}>
        <Table className={classes.table} dense={true} table size="medium" aria-label="simple table">
          <TableBody>
                        <TableRow>
                            <TableCell>Archiv:</TableCell>
                            <TableCell align="right" className="hidden-xs">DropdownSelect Archive</TableCell>
                            <TableCell align="right" className="hidden-xs">Device:</TableCell>
                            <TableCell align="right" className="hidden-xs">Devicename</TableCell>
                            <TableCell align="right" className="hidden-xs">Name:</TableCell>
                            <TableCell align="right" className="hidden-xs">BatchName</TableCell>
                            <TableCell align="right" className="hidden-xs">Start:</TableCell>
                            <TableCell align="right" className="hidden-xs">startDate</TableCell>
                            <TableCell align="right" className="hidden-xs">End:</TableCell>
                            <TableCell align="right" className="hidden-xs">Enddate</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Diagram:</TableCell>
                            <TableCell align="right" className="hidden-xs">DropdownSelect Diagram</TableCell>
                            <TableCell align="right" className="hidden-xs">Original Gravity:</TableCell>
                            <TableCell align="right" className="hidden-xs">OGData</TableCell>
                            <TableCell align="right" className="hidden-xs">Final Gravity:</TableCell>
                            <TableCell align="right" className="hidden-xs">FGData</TableCell>
                            <TableCell align="right" className="hidden-xs">Attenuation:</TableCell>
                            <TableCell align="right" className="hidden-xs">ATData</TableCell>
                            <TableCell align="right" className="hidden-xs">Alcohol:</TableCell>
                            <TableCell align="right" className="hidden-xs">ABVData</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Calibration:</TableCell>
                            <TableCell align="right" className="hidden-xs">Calibration Formular</TableCell>
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
            title="Delete logs"
            message="Do you want to delete the selected logs?"
            callback={clear_logs}
            />
          <DeleteDialog
            title="Delete all logs"
            message="Do you really want to delete ALL logs?"
            callback={clear_all_logs}
            icon="deletesweep"
          />
        </Grid>
        <Grid item xs="12">
          <Plot
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
                r: 20,
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
                  size: 8,
                  color: "#fff",
                },
              },
              xaxis: {
                showgrid: false,
                tickfont: {
                  size: 10,
                  color: "#fff",
                },
              },
              yaxis: {
                showgrid: true,
                tickformat: '.1f',
                tickfont: {
                  size: 10,
                  color: "#fff",
                },
              },
            }}
          />
        </Grid>
      </Grid>
      </Container>
    </>
  );
};
