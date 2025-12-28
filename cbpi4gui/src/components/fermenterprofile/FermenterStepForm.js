import { Breadcrumbs, Container, Divider, Link, Paper, Typography } from "@mui/material";
import { styled } from '@material-ui/core/styles';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CBPiContext, useCBPi } from "../data";
import { fermenterapi } from "../data/fermenterapi";
import PropsEdit from "../util/PropsEdit";
import FermenterStepTypeSelct from "../util/FermenterStepTypeSelect";

const PREFIX = 'FermenterStepForm';

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

const FermenterStepForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [props, setProps] = useState({})
  const [propsConfig, setPropsConfig] = useState(null);
  const { id } = useParams();
  const { fermenterid } = useParams();
  const { state } = useCBPi();
  const { actions } = useContext(CBPiContext);

  const save = () => {
    const data = {
      name,
      type,
      props,
    };

    if (id) {
      fermenterapi.updatestep(fermenterid, id, data, (data) => {
        //console.log("Test");
         });
         navigate("/fermenterprofile/"+fermenterid);
    } else {
      fermenterapi.addstep(fermenterid, data, (data) => {
        
        navigate("/fermenterprofile/"+fermenterid);
      });
    }
  };
  const onSelectType = (e) => {
    const name = e.target.value;
    setType(name);
    const type2 = state.stepTypesFermenter.find((item) => item.name === name);
    setPropsConfig(type2?.properties);
  };
  const onChangeProps = (name, value) => setProps({...props, [name]: value})


  useEffect(() => {
    if (id && fermenterid) {
      const fermentersteps = actions.get_fermentersteps_by_id(fermenterid)
      const k = fermentersteps.steps.find(item => item.id === id);

      if (k) {
        setName(k.name);
        setType(k.type);
        setProps(k.props)
        if (k.type) {
          setPropsConfig(state.stepTypesFermenter.find((item) => item.name === k.type)?.properties);
        }
      }
    }
  }, [state.fermenter]);

  return (
    (<Root>
      <Container maxWidth="lg">
        <Typography variant="h6" gutterBottom>
          Step Config
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={() => {
              navigate("/fermenterprofile/"+fermenterid);
            }}
          >
            Fermenter Profile
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
              <FermenterStepTypeSelct value={type} onChange={onSelectType} />
            </Grid>

            <PropsEdit config={propsConfig} data={props} onChange={onChangeProps} />
          </Grid>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                navigate("/fermenterprofile/"+fermenterid);
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

export default FermenterStepForm;
