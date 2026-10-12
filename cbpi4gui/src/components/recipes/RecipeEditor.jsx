import { Breadcrumbs, Container, Divider, Grid, IconButton, Link, Typography,Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recipeapi } from "../data/recipeapi";
import Header from "../util/Header";
import { BasicData } from "./BasicData";
import { MashStepList } from "./MashStepList";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteDialog from "../util/DeleteDialog";
import { CloneRecipeDialog } from "./CloneRecipeDialog";
import { CBPiPaddleIcon } from "../util/icons/CBPiSensorIcon";

const RecipeEditor = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [basicData, setBasicData] = useState({ name: "", author: "", desc: "" });
  
  useEffect(() => {
    if (id) {
      const success = (data) => {
        setBasicData(data.basic);
        setSteps(data.steps);
        };

      recipeapi.load(id, success);
    }
  }, [id]);

  const save = () => recipeapi.save(id, { basic: basicData, steps });
  const addStep = () => setSteps([...steps, { name: "", props: {}, type: "" }]);
  const back = () => navigate("/recipes");
  const brew = () => {
    recipeapi.brew(id)
    navigate("/mashprofile")
  }

  const remove = () => {
    recipeapi.remove(id);
    navigate(-1);
  };

  const clone = () => {
    setOpen(true)
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
        <Tooltip title="Send recipe to Kettle">
        <IconButton variant="contained" onClick={brew}>
          <CBPiPaddleIcon />
        </IconButton>
        </Tooltip>
        <Tooltip title="Save recipe">        
        <IconButton variant="contained" onClick={save}>
          <SaveIcon />
        </IconButton>
        </Tooltip>
        <DeleteDialog
            title="Delete Recipe"
            message="Do you want to delete the Recipe"
            callback={remove}
          />
      </Header>

      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          onClick={() => {
            navigate("/mashprofile");
          }}
        >
          Active Recipe
        </Link>
        <Link
          color="inherit"
          onClick={() => {
            navigate("/recipes");
          }}
        >
          Recipe Book
        </Link>
        <Typography color="textPrimary">{basicData.name}</Typography>
      </Breadcrumbs>
          <Divider/>

      <BasicData data={basicData} setData={setBasicData} />
      <Header title="Brew Steps">
        <IconButton variant="contained" onClick={addStep}>
          <AddIcon />
        </IconButton>
      </Header>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <MashStepList items={steps} setItems={setSteps} />
        </Grid>
      </Grid>
      </Container>
    </>
  );
};

export default RecipeEditor;
