import AppBar from "@mui/material/AppBar";
import { styled } from '@mui/material/styles';
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import React, {useRef, useLayoutEffect, useState, useEffect} from "react";
import "../../App.css";
import { configapi } from "../data/configapi";
import Menu from "../util/Menu";
import logo from "../../images/cbpi_no_border.png";
import NotificationsDeleteDialog from "../util/NotificationsDeleteDialog";

const PREFIX = 'MainMenu';

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

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
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
    zIndex: theme.zIndex.drawer - 1,
    background: "#00FF00",
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

  [`& .${classes.appBarSpacer}`]: theme.mixins.toolbar,

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

const MainMenu = () => {

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
  <Root className={classes.root}>
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
          <Drawer className={classes.drawerPaper} open={open} onClose={() => setOpen(false)}>
            <Menu onClose={() => setOpen(false)} />
          </Drawer>
          
          <div className={classes.appBarSpacer} />         
  </Root>
);
    };


export default MainMenu;

/*

*/
