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
import { useNavigate , useParams} from "react-router-dom";

import { useCBPi } from "../data";
import { fermenterapi } from "../data/fermenterapi"; 
import FermenterDeleteDialog from "../util/FermenterDeleteDialog";  
import Header from "../util/Header";
import FermenterControl from "../util/FermenterControl"; 
import StepStateChip from "../util/StepStateChip"; // Eventuell Anpassen. Sollte aber so passen
import SortButton from "./FermenterSortButton";
import FermenterSelect from "../util/FermenterSelect";
import FermenterSaveDialog from "../util/FermenterSaveDialog";

const useStyles = makeStyles((theme) => ({
  table: {},
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const FermenterProfile = () => {
  const classes = useStyles();
  const { state } = useCBPi();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [brewname, setBrewName] = useState("");
  const { fermenterid } = useParams();
  
  useEffect(() => {
   if ((fermenterid) && (state.fermentersteps.length !== 0)) {
    try {
      const step= state.fermentersteps.find(step => step.id === fermenterid).steps;
      const name= state.fermenter.find(fermenter => fermenter.id === fermenterid).brewname + "                              ";
      setData(step);
      setBrewName(name.substring(0,30))}
    catch (e) {
      console.log(e);
    }
    
    };
   }, [state.fermentersteps,fermenterid]);

  
  function remove_callback(fermenterid, id) {
    fermenterapi.deletestep(fermenterid, id); 
  }

  const moveCallback = (fermenterid, id, direction) => {
    fermenterapi.movestep(fermenterid, id, direction); 
  };

  const clear = (fermenterid) => {
    fermenterapi.clearsteps(fermenterid); 
  };

  const savetobook = (fermenterid) => {
    fermenterapi.savetobook(fermenterid); // fermenterapi anpassen
  };

  const onChange = (e) => {
    if (e.target.value) {
    fermenterapi.getsteps(e.target.value, (data) => {
    setData(data.steps)
    navigate("/fermenterprofile/"+e.target.value)});
    };
  };


  if (!fermenterid) { // Mashbasic finden und anpassen (vermutlich //data/index.js)
    return (
      <>
      <Container maxWidth="lg">
      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            {"                              "}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Select Fermenter : {" "}
          </Typography> 
          <FermenterSelect value={fermenterid} onChange={onChange} label="" />
        </Grid>

        <Grid>
          <Tooltip title="Open Recipebook">
        <IconButton
            variant="contained"
            onClick={() => {
              navigate("/fermenterrecipes");
            }}
          >
            <MenuBookIcon />
          </IconButton>
          </Tooltip>

        </Grid>

        </Grid>
        </Container>
        </>
    );
  }
 {
  return (
    <>
    <Container maxWidth="lg">
      <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            {brewname}
            {/*<Typography display="inline" color="textSecondary">
              by {state.mashBasic.author}
            </Typography>*/}
          </Typography>
          {/*<Typography color="textSecondary">{state.mashBasic.desc}</Typography>*/}
        </Grid>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Select Fermenter : {" "}
          </Typography> 
          <FermenterSelect value={fermenterid} onChange={onChange} label="" />
        </Grid>

        <Grid item>
                    
          <FermenterDeleteDialog title="Clear" callback={clear} fermenterid={fermenterid} message="Do you want to clear the Fermenter Profile" />
          
          <FermenterSaveDialog title="Save" callback={savetobook} fermenterid={fermenterid} message="Do you want to save your recipe to the recipe book" />
          <Tooltip title="Open Recipebook">
          <IconButton
            variant="contained"
            onClick={() => {
              navigate("/fermenterrecipes");
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
                <FermenterControl fermenterid={fermenterid} />
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate("/fermenterstep/"+fermenterid)}>
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
                        <SortButton index={index} length={data.length} fermenterid={fermenterid} id={row.id} moveCallback={moveCallback} />
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
                        <FermenterDeleteDialog title="Delete Step" message="Do you want to delete the step" fermenterid={fermenterid} id={row.id} callback={remove_callback} />
                        
                        <IconButton aria-label="add" size="small" onClick={() => navigate("/fermenterstep/" + row.id + "/" + fermenterid)}>
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
};
export default FermenterProfile;
