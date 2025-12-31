import { Breadcrumbs, Container, Divider, Paper,InputBase, IconButton, Link, List, ListItemButton, ListItemText, ListItemIcon, Tooltip } from "@mui/material";
import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipeapi } from "../data/recipeapi";
import { NewRecipeDialog } from "./NewRecipeDialog";
import SearchIcon from "@mui/icons-material/Search";
import { CBPiBeerIcon } from "../util/icons/CBPiSensorIcon";
const PREFIX = 'Recipes';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  input: `${PREFIX}-input`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    flexGrow: 1,
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },

  [`& .${classes.input}`]: {
    marginLeft: theme.spacing(1),
    flex: 1,
  }
}));



const Recipes = () => {
  const [totalList, setTotalList] = useState([]);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("");


  useEffect(() => {
    recipeapi.get((data) => {
      setTotalList(data)
      setList(data);
    });
  }, []);

  useEffect(() => {
    console.log(filter)
    if(filter) {
      setList(totalList.filter(item=> item?.name.includes(filter) ))
    }
    else {
      setList(totalList)
    }
  }, [filter]);

  

  const openRecipe = (file) => {
    navigate("/recipe/" + file);
  };

  const createRecipe = () => {
    setOpen(true)

  }

 


  return (
    (<Root>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: 10 }}>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Recipes
            </Typography>
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
          <Tooltip title="Create new recipe">
            <IconButton variant="contained" onClick={createRecipe}>
              <AddIcon />
            </IconButton>
            </Tooltip>
            <NewRecipeDialog open={open} setOpen={setOpen}/>
          </Grid>
        </Grid>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            onClick={() => {
              navigate("/mashprofile");
            }}
          >
            Active Recipe
          </Link>
          <Typography color="textPrimary">Recipes</Typography>
        </Breadcrumbs>
        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
        <List>
          {list.map((item) => (
            <Tooltip title="Click to select recipe">
            <ListItemButton onClick={() => openRecipe(item.file)}>
              <ListItemIcon>
                <CBPiBeerIcon/>
              </ListItemIcon>
              <ListItemText primary={item.name || "No Name"} secondary={item.desc} />
            </ListItemButton>
            </Tooltip>
          ))}
        </List>
        </Container>
    </Root>)
  );
};

export default Recipes;
