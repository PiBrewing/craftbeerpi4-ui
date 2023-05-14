import { Container, Divider, Grid, IconButton, Typography } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { ToggleButton } from "@mui/material";
import { ToggleButtonGroup } from '@mui/material';
import { useState } from "react";
import Plot from "react-plotly.js";
import { useSensor } from "../data";
import { logapi } from "../data/logapi";
import DeleteDialog from "../util/DeleteDialog";
import { useNavigate } from "react-router-dom";

export const Charting = () => {
  const navigate = useNavigate();
  const sensors = useSensor();
  const [formats, setFormats] = useState(() => []);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

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
          Analytics
          </Typography>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: 10, marginTop: 10 }} />
      <Grid container spacing={3}>
        <Grid item xs="12">
          <ToggleButtonGroup color="primary" value={formats} onChange={handleFormat} aria-label="text formatting">
            {sensors.map((item, index) => (
              <ToggleButton value={item.id} aria-label="bold">
                {item.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <IconButton onClick={load}>
            <AutorenewIcon className={loading ? "rotating-right" : "" }/>
          </IconButton>
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
