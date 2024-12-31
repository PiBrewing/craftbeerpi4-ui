import { Container, Divider, Grid, IconButton, Typography, Table, TableContainer, TableBody,TableCell,TableHead,TableRow } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { ToggleButton, Tooltip } from "@mui/material";
import { ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSensor } from "../data";
import { logapi } from "../data/logapi";
import DeleteDialog from "../util/DeleteDialog";
import { useNavigate , useParams} from "react-router-dom";
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { sqlapi } from "../data/sqlapi";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from '@mui/material/InputLabel';

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
  const sensors = useSensor();
  const [formats, setFormats] = useState(() => []);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };
  const { archive } = useParams();
  const { diagram } = useParams();
  const [archivelist, setArchivelist] = useState([]);
  const [currentarchive, setCurrentarchive] = useState([]);
  const [diagramlist, setDiagramlist] = useState([]);
  const [currentdiagram, setCurrentdiagram] = useState([]);
  const [archiveheader, setArchiveheader] = useState([]);

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
  
  useEffect(() => {
    sqlapi.getarchivelist((data) => {
      setArchivelist(data);
      setCurrentarchive(data[0].value);
      sqlapi.getarchiveheader(data[0].value, (data) => {  
        setArchiveheader(data);
        console.log(data);
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
    sqlapi.getarchiveheader(currentarchive, (data) => { 
      setArchiveheader(data);
      console.log(data);  
    });
  }, [currentarchive]);


  const ArchiveChange = (event) => {
    setCurrentarchive(event.target.value);
    //navigate("/data/"+event.target.value+"/"+currentdiagram);
    };

  const DiagramChange = (event) => {
    //navigate("/data/"+currentarchive+"/"+event.target.value);
      setCurrentdiagram(event.target.value);
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
                <TableCell style={{minWidth:370, maxWidth:370}}>
                  <InputLabel id="demo-simple-select-helper-label">Archive:</InputLabel>
                  <SelectBox options={archivelist} value={currentarchive} onChange={ArchiveChange} />
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
                  <SelectBox options={diagramlist} value={currentdiagram} onChange={DiagramChange} />
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
                  <InputLabel id="demo-simple-select-helper-label">Calibration:</InputLabel>
                  {archiveheader.Const0}* titl^3 {archiveheader.Const1} * tilt^2 {archiveheader.Const2} * tilt + {archiveheader.Const3}
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
