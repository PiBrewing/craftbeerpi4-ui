import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import React, {useRef, useLayoutEffect, useState, useEffect} from "react";
import "../../App.css";
import { configapi } from "../data/configapi";
import Menu from "../util/Menu";
import logo from "../../images/cbpi_no_border.png";
import NotificationsDeleteDialog from "../util/NotificationsDeleteDialog";

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
    background: "#00FF00",
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

const MainMenu = () => {
  const classes = useStyles();
  const navBarRef = useRef();
  const [open, setOpen] = useState(false);
  const [brewery,setBrewery] = useState("CraftBeerPi 4.0");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  configapi.getone('BREWERY_NAME', (data) => {
    if (data){
      setBrewery(data);
       }
      });
  
  useLayoutEffect(() => {
    const updateNavBarHeight = () => {
      if (!navBarRef.current)
        return;

    };
    window.addEventListener("resize", updateNavBarHeight);
    updateNavBarHeight();
    return () => window.removeEventListener("resize", updateNavBarHeight);
  }, []);
 
return (
      <>
      <div>
            <AppBar enableColorOnDark ref={navBarRef}  position="absolute" className={classes.appBar}>
              <Toolbar className={classes.toolbar}>
                <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={classes.menuButton}>
                  <MenuIcon />
                </IconButton>
                <div className={classes.title} style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                  <img width={30} src={logo} style={{ marginRight: 10 }} alt="CBPi Logo"/>
                  <Typography component="h1" variant="h4" color="inherit" noWrap>
                    {brewery}
                  </Typography>
                </div>
                    <NotificationsDeleteDialog/>
              </Toolbar>
            </AppBar>
            <Drawer open={open} onClose={() => setOpen(false)}>
              <Menu onClose={() => setOpen(false)} />
            </Drawer>
            
            <div className={classes.appBarSpacer} />         
            </div>
      </>
    );
    };
  

export default MainMenu;

/*

*/
