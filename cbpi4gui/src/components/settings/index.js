import { Container, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { useCBPi } from "../data";
import { configapi } from "../data/configapi";
import SaveIcon from "@mui/icons-material/Save";
import ActorSelect from "../util/ActorSelect";
import KettleSelect from "../util/KettleSelect";
import FermenterSelect from "../util/FermenterSelect";
import SensorSelect from "../util/SensorSelect";
import StepTypeSelect from "../util/StepTypeSelect";
import { useNavigate, useParams } from "react-router-dom";
import { pluginapi } from "../data/pluginapi";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
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

const ConfigInput = ({ item, onChange, value, options }) => {

  switch (item.type) {
    case "select":
      return <SelectBox options={options} value={value} onChange={onChange} />
    case "kettle":
      return <KettleSelect value={value} onChange={onChange} label="" />;
    case "fermenter":
      return <FermenterSelect value={value} onChange={onChange} label="" />;
    case "sensor":
      return <SensorSelect value={value} onChange={onChange} label="" />;
    case "step":
      return <StepTypeSelect value={value} onChange={onChange} label="" />;
    case "actor":
      return <ActorSelect description={item.description} value={value} onChange={onChange} />;
    case "number":
      return <TextField variant="standard" onChange={onChange} value={value} />;
    default:
      return <TextField variant="standard" onChange={onChange} value={value} />;
  }



  
};

const Settings = () => {
  const { config: state } = useCBPi();
  const [config, setConfig] = useState({});
  const [filter, setFilter] = useState("");
  const classes = useStyles();
  const navigate = useNavigate();
  const { source } = useParams();
  const [sources, setSources] = useState([]);

  useEffect(() => {
    pluginapi.getpluginnames((data) => {
      setSources(data);
    });
  }, []);

  if (!source){
    navigate("/settings/All")
  };

  useEffect(() => {
    setConfig({ ...state });
  }, [state]);

  const onChange = (field, e) => {
    setConfig({ ...config, [field]: { ...config[field], changed: true, value: e.target.value } });
  };

  const onSelectSource = (e) => {
    if (e.target.value) {
    navigate("/settings/"+e.target.value)};
    };

  const save = () => {
    Object.keys(config).map((key) => {
      const parameter = config[key];
      if (parameter.changed) {
        configapi.update(key, parameter.value);
        setConfig((curret_config) => ({ ...curret_config, [key]: { ...curret_config[key], changed: false } }));
        navigate(0);
      }

    });
    
  };


  const reset = () => {
    setConfig({ ...state });
    
  };

  let data = config;

  if ((filter && !source) || (filter && source === "All" )) {
    data = Object.keys(data)
      .filter((key) => key.toLowerCase().includes(filter.toLowerCase()))
      .reduce((obj, key) => {
        console.log(data[key].source)
        if (data[key].source !== "hidden"){
        obj[key] = data[key];
        }
        return obj;
      }, {});
  }

  if ((source && filter) && source !=="All")  {
    data = Object.keys(data)
      .filter((key) => key.toLowerCase().includes(filter.toLowerCase()))
      .reduce((obj, key) => {
        if (data[key].source === source) {
        obj[key] = data[key];
        }
        return obj;
      }, {});
  }

  if ((source && !filter) && source !== "All")  {
    data = Object.keys(data)
      .reduce((obj, key) => {
        if (data[key].source === source) {
        obj[key] = data[key];
        }
        return obj;
      }, {});
  }

  if (!filter && source === "All")  {
    data = Object.keys(data)
      .reduce((obj, key) => {
        if (data[key].source !== "hidden") {
        obj[key] = data[key];
        }
        return obj;
      }, {});
  }

  return (
    <>
    <Container maxWidth="lg">
      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Settings
          </Typography>
        </Grid>
        <Grid>
        <SelectBox options={sources} value={source} onChange={onSelectSource} />
        </Grid>
        <Grid item>
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              placeholder="Filter"
              inputProps={{ "aria-label": "filter settings" }}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item>
          <IconButton onClick={reset}>
          <RotateLeftIcon />
            </IconButton>
            <IconButton onClick={save}>
              <SaveIcon />
            </IconButton>
          
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(data).map((key) => (
              <TableRow key={key} selected={config[key].changed}>
                <TableCell component="th" scope="row">
                  {key}
                  <div>
                    <small>{config[key].description}</small>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <ConfigInput onChange={(e) => onChange(key, e)} item={config[key]} value={config[key].value} options={config[key].options} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    </>
  );
};

export default Settings;
