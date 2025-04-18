import { Button, TextField, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";

const SetRecipeDialog = ({ btnText, spindle, title, message, callback, id }) => {
  const [open, setOpen] = React.useState(false);
  const [recipeName, setRecipeName] = React.useState("");
  const [batchId, setBatchId] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const no = () => {
    setOpen(false);
  };

  const yes = () => {
    setOpen(false);
    callback(id, spindle.label, recipeName, batchId);
  };

  const changeRecipeName = (event) => {
    setRecipeName(event.target.value);
  };

  const changeBatchId = (event) => {
    setBatchId(event.target.value);
  }

  
  return (
    <>
      {btnText ? (
        <Tooltip title="Save">
        <Button color="secondary" onClick={handleClickOpen} variant="contained" size="small" startIcon={<SaveIcon />}>
          {btnText}
        </Button>
        </Tooltip>
      ) : (
        <Tooltip title="Save">
        <IconButton aria-label="save"  onClick={handleClickOpen}>
          <SaveIcon />
        </IconButton>
        </Tooltip>
      )}

      <Dialog open={open} onClose={no} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title + spindle?.label}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Recipe Name" type="text" fullWidth variant="standard" value={recipeName} onChange={changeRecipeName}/>
          <TextField autoFocus margin="dense" id="name" label="Batch ID (e.g. 2501 for first batch in 2025)" type="text" fullWidth variant="standard" value={batchId} onChange={changeBatchId}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={no} color="secondary" autoFocus variant="contained">
            No
          </Button>
          <Button onClick={yes} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SetRecipeDialog;
