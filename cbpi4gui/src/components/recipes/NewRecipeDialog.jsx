import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { recipeapi } from "../data/recipeapi";


export const NewRecipeDialog = ({open, setOpen}) => {

    const navigate = useNavigate()
    const [name, setName] = useState("")

    const create = () => {
        recipeapi.create(name, (id)=> {
            navigate("/recipe/" + id);
          })
    }

    const cancel = () => {
        setOpen(false)
    }

    return <Dialog open={open} onClose={cancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
    <DialogTitle id="alert-dialog-title">New Recipe</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
            <TextField variant="standard" label="Name" value={name} onChange={(e)=>setName(e.target.value)} />
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={cancel} color="secondary" autoFocus variant="contained">
        Cancel
      </Button>
      <Button onClick={create} color="primary" variant="contained">
        Create
      </Button>
    </DialogActions>
  </Dialog>


}