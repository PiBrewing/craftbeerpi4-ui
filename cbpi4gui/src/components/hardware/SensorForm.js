import { Breadcrumbs, Container, Divider, Link, Paper, Typography } from "@mui/material";
import { styled } from '@material-ui/core/styles';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCBPi } from "../data";
import PropsEdit from "../util/PropsEdit";
import SensorTypeSelect from "../util/SensorTypeSelect";

const PREFIX = 'SensorForm';

const classes = {
  appBar: `${PREFIX}-appBar`,
  layout: `${PREFIX}-layout`,
  paper: `${PREFIX}-paper`,
  stepper: `${PREFIX}-stepper`,
  buttons: `${PREFIX}-buttons`,
  button: `${PREFIX}-button`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.appBar}`]: {
    position: "relative",
  },

  [`& .${classes.layout}`]: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  [`& .${classes.paper}`]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },

  [`& .${classes.stepper}`]: {
    padding: theme.spacing(3, 0, 5),
  },

  [`& .${classes.buttons}`]: {
    display: "flex",
    justifyContent: "flex-end",
  },

  [`& .${classes.button}`]: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  }
}));

const SensorForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const { id } = useParams();
  const { sensor, state, actions } = useCBPi();
  const [propsConfig, setPropsConfig] = useState(null);
  const [props, setProps] = useState({});

  useEffect(() => {
    if (id) {
      const item = sensor.find((item) => item.id === id);
      if (item) {
        setName(item.name);
        setType(item.type);
        setProps(item.props);
        if (item.type) {
          setPropsConfig(state.sensorTypes.find((i) => i.name === item.type)?.properties);
        }
      }
    }
  }, []);

  const save = () => {
    const data = { name, type, props };

    if (id) {
      actions.update_sensor(id, data, () => navigate("/hardware"));
    } else {
      actions.add_sensor(data, () => navigate("/hardware"));
    }
  };

  const onChangeProps = (name, value) => {
    setProps({ ...props, [name]: value });
  };

  const onChangeType = (e) =>  {
    const value = e.target.value
    setType(value)
    if (value) {
      setPropsConfig(state.sensorTypes.find((i) => i.name === value)?.properties);
    }
  }

  return (
    (<Root>
      <Container maxWidth="lg">
        <Typography variant="h6" gutterBottom>
          Sensor Config
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={() => {
              navigate("/hardware");
            }}
          >
            Sensor
          </Link>
          <Typography color="textPrimary">{name}</Typography>
        </Breadcrumbs>

        <Divider />
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField variant="standard" required id="name" label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SensorTypeSelect label="Type" value={type} onChange={onChangeType} />
            </Grid>

            <PropsEdit config={propsConfig} data={props} onChange={onChangeProps} />
          </Grid>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                navigate("/hardware");
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
    </Root>)
  );
};

export default SensorForm;
