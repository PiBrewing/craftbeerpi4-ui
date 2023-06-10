import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fermenterrecipeapi } from "../data/fermenterrecipeapi";
import FermenterSelect from "../util/FermenterSelect";
import { Typography } from "@mui/material";


export const BrewRecipeDialog = ({id, name, open, setOpen}) => {

    const navigate = useNavigate()
    const [fermenterid, setFermenterID] = useState([])
    const cleanname= name.replace(/[/]|%|[?]|[&]/g, '')

    const brew = () => {
      console.log(id)
      //const cleanname= name.replace(/[/]|%|[?]/g, '_')
      fermenterrecipeapi.brew(fermenterid, id, cleanname);
      setOpen(false)
      navigate("/fermenterprofile/"+ fermenterid);
    }
    const cancel = () => {
        setOpen(false)
    }

    const onChange = (e) => {
      if (e.target.value) {
      setFermenterID(e.target.value)
      };
    }

    return <Dialog open={open} onClose={cancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
    <DialogTitle id="alert-dialog-title">Send Recipe "{cleanname}" to Fermenter</DialogTitle>
    <DialogContent>
           <Typography variant="h5" gutterBottom>
            Select Fermenter : {" "}
          </Typography> 
          <FermenterSelect value={fermenterid} onChange={onChange} label="" />      
    </DialogContent>
    <DialogActions>
      <Button onClick={cancel} color="secondary" autoFocus variant="contained">
        Cancel
      </Button>
      <Button onClick={brew} color="primary" variant="contained">
        Send
      </Button>
    </DialogActions>
  </Dialog>


}