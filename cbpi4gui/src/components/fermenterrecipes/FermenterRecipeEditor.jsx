import { Breadcrumbs, Container, Divider, Grid, IconButton, Link, Typography,Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fermenterrecipeapi } from "../data/fermenterrecipeapi";
import Header from "../util/Header";
import { BasicData } from "./BasicData";
import { FermenterStepList } from "./FermenterStepList";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteDialog from "../util/DeleteDialog";
import { CloneRecipeDialog } from "./CloneRecipeDialog";
import { BrewRecipeDialog } from "./BrewRecipeDialog";
import { CBPiTankIcon } from "../util/icons/CBPiSensorIcon";

const FermenterRecipeEditor = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false)
  const [openferment, setOpenferment] = useState(false)
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [basicData, setBasicData] = useState({ name: "", author: "", desc: "" });
  
  useEffect(() => {
    let isMounted = true;
    if (id) {
        const success = (data) => {
            if (isMounted) {
                setBasicData(data.basic);
                setSteps(data.steps);
            }
        };
        fermenterrecipeapi.load(id, success);
    }
    return () => { isMounted = false; }; // ✅ Abbruchbedingung
}, [id]);

  const save = () => fermenterrecipeapi.save(id, { basic: basicData, steps });
  const addStep = () => setSteps([...steps, { name: "", props: {}, type: "" }]);
  const back = () => navigate("/fermenterrecipes");

  //--> Fermenter / fermenterid needs to be selcted in form
 // const brew = () => {
 //   fermenterrecipeapi.brew(id)
 //   navigate("/fermenterprofile")
 // }

  const remove = () => {
    fermenterrecipeapi.remove(id);
    navigate(-1);
  };

  const clone = () => {
    setOpen(true)
  };

  const ferment = () => {
    setOpenferment(true)
  };

  return (
    <>
    <Container maxWidth="lg">
      <Header title="Basic Data">
      <Tooltip title="Back to recipe book">
        <IconButton variant="contained" onClick={back}>
          <ArrowBackIcon />
        </IconButton>
        </Tooltip>
        <Tooltip title="Clone recipe">
        <IconButton variant="contained" onClick={clone}>
          <FileCopyIcon />
        </IconButton>
        </Tooltip>
        <CloneRecipeDialog id={id} open={open} setOpen={setOpen}/>
        <Tooltip title="Send recipe to fermenter">
        <IconButton variant="contained" onClick={ferment}>
          <CBPiTankIcon />
        </IconButton>
        </Tooltip>
        <BrewRecipeDialog id={id} name={basicData.name} open={openferment} setOpen={setOpenferment}/>
        <Tooltip title="Save recipe">
        <IconButton variant="contained" onClick={save}>
          <SaveIcon />
        </IconButton>
        </Tooltip>
        <DeleteDialog
            title="Delete Fermenter Recipe"
            message="Do you want to delete the Fermenter Recipe"
            callback={remove}
          />
      </Header>

      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          onClick={() => {
            navigate("/fermenterprofile");
          }}
        >
          Active Recipe
        </Link>
        <Link
          color="inherit"
          onClick={() => {
            navigate("/fermenterrecipes");
          }}
        >
          Fermenter Recipe Book
        </Link>
        <Typography color="textPrimary">{basicData.name}</Typography>
      </Breadcrumbs>
          <Divider/>

      <BasicData data={basicData} setData={setBasicData} />
      <Header title="Fermenter Steps">
        <IconButton variant="contained" onClick={addStep}>
          <AddIcon />
        </IconButton>
      </Header>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <FermenterStepList items={steps} setItems={setSteps} />
        </Grid>
      </Grid>
      </Container>
    </>
  );
};

export default FermenterRecipeEditor;
