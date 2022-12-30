import { Button, Container, Divider, IconButton, makeStyles, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import Header from "../util/Header";
import ActorTable from "./ActorTable";
import KettleTable from "./KettleTable";
import SensorTable from "./SensorTable";
import FermenterTable from "./FermenterTable";

const useStyles = makeStyles((theme) => ({
  table: {},
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export default function Hardware() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <>
    <Container style={{ marginTop: 64 }}>
      <Grid container direction="row" justify="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Hardware
          </Typography>
        </Grid>
        <Grid item></Grid>
      </Grid>

      <Divider style={{ marginBottom: 10, marginTop: 10 }} />
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Paper className={classes.paper}>
            <Header title="Kettle">
              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/kettle");
                }}
              >
                <AddIcon />
              </IconButton>
            </Header>
            <KettleTable />
          </Paper>
        </Grid>
        <Grid item sm={12}>
          <Paper className={classes.paper}>
            <Header title="Fermenter">
              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/fermenter");
                }}
              >
                <AddIcon />
              </IconButton>
            </Header>
            <FermenterTable />
          </Paper>
        </Grid>
        <Grid item sm={12}>
          <Paper className={classes.paper}>
            <Header title="Sensor">
              

              <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/sensor");
                }}
              >
                <AddIcon />
              </IconButton>
            </Header>
            <SensorTable />
          </Paper>
        </Grid>
        <Grid item sm={12}>
          <Paper className={classes.paper}>
            <Header title="Actor">
            <IconButton
                variant="contained"
                onClick={() => {
                  navigate("/actor");
                }}
              >
                <AddIcon />
              </IconButton>
            </Header>
            <ActorTable />
          </Paper>
        </Grid>
      </Grid>
      </Container>
    </>
  );
}
