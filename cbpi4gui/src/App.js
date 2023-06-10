import { Container, GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { makeStyles } from "@mui/styles";
import React, {useRef, useLayoutEffect, useState} from "react";
import { HashRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import About from "./components/about";
import Upload from "./components/upload";
import CBPiSystem from "./components/system";
import {Dashboard2 , FixDashboard} from "./components/dashboard/Dashboard";
import Hardware from "./components/hardware";
import ActorForm from "./components/hardware/ActorForm";
import KettleForm from "./components/hardware/KettleForm";
import FermenterForm from "./components/hardware/FermenterForm";
import SensorForm from "./components/hardware/SensorForm";
import Plugins from "./components/plugins";
import MashProfile from "./components/mashprofile";
import FermenterProfile from "./components/fermenterprofile";
import Settings from "./components/settings";
import StepForm from "./components/mashprofile/StepForm";
import FermenterStepForm from "./components/fermenterprofile/FermenterStepForm";
import Recipes from "./components/recipes";
import FermenterRecipes from "./components/fermenterrecipes";
import RecipeEditor from "./components/recipes/RecipeEditor";
import FermenterRecipeEditor from "./components/fermenterrecipes/FermenterRecipeEditor";
import { Charting } from "./components/charting";
import MainMenu from "./components/MainMenu";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,

    height: "100vh",
//    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
    position: "absolute",   
//	top: "64px",
	bottom: 0,
	overflowY: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  dashoard: {
    data: theme.mixins.toolbar,
  },
  snack: {
    position: "absolute",
    bottom: 10,
    right: 30,
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
}));

const CraftBeerPiApp = () => {
  const classes = useStyles();
  const navBarRef = useRef();
  const [appBarHeight, setAppBarHeight] = useState(64);
    
  
  useLayoutEffect(() => {
    const updateNavBarHeight = () => {
      if (!navBarRef.current)
        return;
      const newHeight = navBarRef.current.clientHeight;
//	  console.log("Navbar height = " + newHeight);
      setAppBarHeight(newHeight);
    };
    window.addEventListener("resize", updateNavBarHeight);
    updateNavBarHeight();
    return () => window.removeEventListener("resize", updateNavBarHeight);
  }, []);

  
  const AppLayout = () => (
    <>
      <MainMenu />
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
        <Container  maxWidth={false} className={classes.container} style={{ top: appBarHeight }}>
          <Outlet />
        </Container> 
        </main>
    </>
  );


  return (
    <div className={classes.root}>
      <CssBaseline />
      <GlobalStyles
          styles={{
            body: { backgroundColor: "#444444" },
          }}
        />
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout /> } >
                  <Route path="/" element={<Dashboard2 />}/>   
                  <Route path="fixdash/:dashboardid" element={<FixDashboard />}/>
                  <Route path="plugins" element={<Plugins />} />
                  <Route path="about" element={<About />}/>
                  <Route path="upload" element={<Upload />}/>
                  <Route path="system" element={<CBPiSystem />}/>
                  <Route path="hardware" element={<Hardware />}/>
                  <Route path="kettle/:id" element={<KettleForm />}/>
                  <Route path="kettle" element={<KettleForm />}/>
                  <Route path="fermenter/:id" element={<FermenterForm />}/>
                  <Route path="fermenter" element={<FermenterForm />}/>
                  <Route path="actor/:id" element={<ActorForm />}/>
                  <Route path="actor" element={<ActorForm />}/>
                  <Route path="sensor/:id" element={<SensorForm />}/>
                  <Route path="sensor" element={<SensorForm />}/>
                  <Route path="settings" element={<Settings />}/>
                  <Route path="settings/:source" element={<Settings />}/>
                  <Route path="mashprofile" element={<MashProfile />}/>
                  <Route path="fermenterprofile/:fermenterid" element={<FermenterProfile />}/>
                  <Route path="fermenterprofile" element={<FermenterProfile />}/>
                  <Route path="recipes" element={<Recipes />}/>
                  <Route path="fermenterrecipes" element={<FermenterRecipes />}/>
                  <Route path="recipe/:id" element={<RecipeEditor />}/>
                  <Route path="fermenterrecipe/:id" element={<FermenterRecipeEditor />}/>
                  <Route path="step/:id" element={<StepForm />}/>
                  <Route path="step" element={<StepForm />}/>
                  <Route path="fermenterstep/:id/:fermenterid" element={<FermenterStepForm />}/>
                  <Route path="fermenterstep/:fermenterid" element={<FermenterStepForm />}/>
                  <Route path="fermenterstep" element={<FermenterStepForm />}/>
                  <Route path="charting" element={<Charting />}/>              
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default CraftBeerPiApp;

/*

*/
