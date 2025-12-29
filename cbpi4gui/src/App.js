import { Container, GlobalStyles } from "@mui/material";
import { styled } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
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
import { Spindledata } from "./components/spindledata";
import SpindleCalForm from "./components/spindledata/SpindleCalForm";
import CurrentSpindleData from "./components/spindledata/CurrentSpindleData";


const PREFIX = 'CraftBeerPiApp';

const classes = {
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
  toolbarIcon: `${PREFIX}-toolbarIcon`,
  appBar: `${PREFIX}-appBar`,
  appBarShift: `${PREFIX}-appBarShift`,
  menuButton: `${PREFIX}-menuButton`,
  menuButtonHidden: `${PREFIX}-menuButtonHidden`,
  title: `${PREFIX}-title`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  drawerPaperClose: `${PREFIX}-drawerPaperClose`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`,
  dashoard: `${PREFIX}-dashoard`,
  snack: `${PREFIX}-snack`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: "flex",
  },

  [`& .${classes.toolbar}`]: {
    paddingRight: 24, // keep right padding when drawer closed
  },

  [`& .${classes.toolbarIcon}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },

  [`& .${classes.appBar}`]: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  [`& .${classes.appBarShift}`]: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  [`& .${classes.menuButton}`]: {
    marginRight: 36,
  },

  [`& .${classes.menuButtonHidden}`]: {
    display: "none",
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
  },

  [`& .${classes.drawerPaper}`]: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  [`& .${classes.drawerPaperClose}`]: {
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

  [`&.${classes.appBarSpacer}`]: theme.mixins.toolbar,

  [`& .${classes.content}`]: {
    flexGrow: 1,

    height: "100vh",
//    overflow: "auto",
  },

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
    position: "absolute",   
//	top: "64px",
	bottom: 0,
	overflowY: "auto",
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },

  [`& .${classes.fixedHeight}`]: {
    height: 240,
  },

  [`& .${classes.dashoard}`]: {
    data: theme.mixins.toolbar,
  },

  [`& .${classes.snack}`]: {
    position: "absolute",
    bottom: 10,
    right: 30,
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  }
}));


const drawerWidth = 240;

const CraftBeerPiApp = () => {

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
        <Root className={classes.appBarSpacer}>
        <Container  maxWidth={false} className={classes.container} style={{ top: appBarHeight }}>
          <Outlet />
        </Container> 
        </Root>
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
                  <Route path="data" element={<Spindledata />}/>                  
                  <Route path="data/:archive/:diagram" element={<Spindledata />}/> 
                  <Route path="calibrate" element={<SpindleCalForm />}/>
                  <Route path="calibrate/:id" element={<SpindleCalForm />}/>
                  <Route path="currentdata" element={<CurrentSpindleData />}/>

          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default CraftBeerPiApp;

/*

*/
