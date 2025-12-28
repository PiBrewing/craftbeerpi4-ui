import { Breadcrumbs, Container, Divider } from "@mui/material";
import { styled } from '@material-ui/core/styles';
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import logo from '../../images/python-powered.png';
//import IconButton from "@mui/material/IconButton";
//import InputBase from "@mui/material/InputBase";
//import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
//import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { pluginapi } from "../data/pluginapi";

const PREFIX = 'Plugins';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  input: `${PREFIX}-input`
};

const StyledContainer = styled(Container)((
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

const styles = {
  media: {
    height: '30px',
    width: '50px',
    paddingTop: '15%', // 16:9,
    marginTop:'1px',
    marginLeft:'1px'
  }
};

const CBPiCard = ({item}) => {

  let homepage = true;
  if (item["Home-page"] === "UNKNOWN" ) {
    homepage = false;
  }
    return (
   
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={logo}
          title="Logo"
          style={styles.media}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h3">
            {item?.Name} ({item?.Version})
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {item?.Summary}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          Author: {item?.Author}
          </Typography>
          {homepage ? <Button href={item["Home-page"]} color="primary" target="_blank" rel="noreferrer noopener">Homepage</Button> : ""}
          {/*<Typography variant="body2" color="textSecondary" component="p">
          Homepage: {item?.Homepage}
          </Typography>*/}
        </CardContent>
      </CardActionArea>
     {/* 
     <CardActions>
        <Button size="small" color="primary">
          Download
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
        <Button size="small" color="primary">
          Active
        </Button>
     </CardActions> 
     */}
    </Card>
   
  );
};

const Plugins = () => {

  //const { state } = useContext(CBPiContext);

  const [plugininfo, setPluginInfo] = useState([]);

  useEffect(() => {
    pluginapi.getpluginlist((data) => {
      setPluginInfo(data);
    });
  }, []);

  //const [filter, setFilter] = useState("")
 
  //let plugins = state.plugins
  //if(filter) {
  //plugins  = state.plugins.filter(item => item.name.includes(filter) )
 // }
  

  return (
    <StyledContainer maxWidth="lg" >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: 10 }}
      >
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Plugins
          </Typography>
        </Grid>
        {/*<Grid item>
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              value={filter}
              onChange={(e) => {setFilter(e.target.value)}}
              placeholder="Search CBPi Plugins"
              inputProps={{ "aria-label": "search plugins" }}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
  </Grid>*/}
      </Grid>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="textPrimary">Plugins</Typography>
      </Breadcrumbs>
      <Divider />

      <Grid container spacing={3} style={{ marginTop: 10 }}>
        {plugininfo.map((item) => (
          <Grid item sm={4}>
            <CBPiCard item={item} />
          </Grid>
        ))}
      </Grid>
      </StyledContainer>
  );
};

export default Plugins;
