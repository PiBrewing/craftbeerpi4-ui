import { Button, Container, Divider, IconButton, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { default as React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCBPi } from "../data";
import { stepapi } from "../data/stepapi";
import SaveDialog from "../util/SaveDialog";
import DeleteDialog from "../util/DeleteDialog";
import Header from "../util/Header";
import MashControl from "../util/MashControl";
import StepStateChip from "../util/StepStateChip";
import SortButton from "./SortButton";

const useStyles = makeStyles((theme) => ({
  table: {},
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const MashProfile = () => {
  const classes = useStyles();
  const { state } = useCBPi();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(state.mashProfile);
  }, [state.mashProfile]);

  const remove_callback = (id) => {
    stepapi.remove(id);
  };

  const moveCallback = (id, direction) => {
    stepapi.move(id, direction);
  };

  const clear = () => {
    stepapi.clear();
  };

  const savetobook = () => {
    stepapi.savetobook();
  };


  if (!state.mashBasic.name) {
    return (
      <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} style={{display: "flex", justifyContent:"center"}}>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/recipes");
            }} startIcon={<MenuBookIcon />}
          >
            Please select a Recipe
          </Button>

        </Grid>
      </Grid>
      </Container>
    );
  }

  return (
    <>
    <Container maxWidth="lg">
      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            {state.mashBasic.name}{" "}
            <Typography display="inline" color="textSecondary">
              by {state.mashBasic.author}
            </Typography>
          </Typography>
          <Typography color="textSecondary">{state.mashBasic.desc}</Typography>
        </Grid>
        <Grid item>
          
          <DeleteDialog title="Clear" callback={clear} message="Do you want to clear the Mash Profile" />
          
          <SaveDialog title="Save" callback={savetobook} message="Do you want to save your recipe to the recipe book" />
          <Tooltip title="Open Recipe Book">
          <IconButton
            variant="contained"
            onClick={() => {
              navigate("/recipes");
            }}
          >
            <MenuBookIcon />
          </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Divider style={{ marginBottom: 10, marginTop: 10 }} />

      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Paper className={classes.paper}>
            <Header title="Profile">
              <div style={{ display: "flex" }}>
                <MashControl />
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate("/step")}>
                  ADD
                </Button>
              </div>
            </Header>
            <TableContainer size="small">
              <Table className={classes.table} dense table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right" className="hidden-xs">
                      Type
                    </TableCell>
                    <TableCell align="right" className="hidden-xs">
                      Summary
                    </TableCell>
                    <TableCell align="right" className="hidden-xs">
                      State
                    </TableCell>
                    <TableCell align="right" className="hidden-xs">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell width="100px">
                        <SortButton index={index} length={data.length} id={row.id} moveCallback={moveCallback} />
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="right" className="hidden-xs">
                        {row.type}
                      </TableCell>
                      <TableCell align="right" className="hidden-xs">
                        {row.state_text}
                      </TableCell>
                      <TableCell align="right" className="hidden-xs">
                        <StepStateChip state={row.status} />
                      </TableCell>
                      <TableCell align="right" className="hidden-xs">
                        <DeleteDialog title="Delete Step" message="Do you want to delete the step" id={row.id} callback={remove_callback} />
                        
                        <IconButton aria-label="add" size="small" onClick={() => navigate("/step/" + row.id)}>
                          <VisibilityIcon />
                        </IconButton>                        
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      </Container>
    </>
  );
};

export default MashProfile;
