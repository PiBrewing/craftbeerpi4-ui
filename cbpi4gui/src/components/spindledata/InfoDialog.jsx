import { Button, TextField, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";

const InfoDialog = ({ btnText, title, message, callback}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const ok = () => {
    setOpen(false);
  };


  
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

      <Dialog open={open} onClose={ok} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ok} color="secondary" autoFocus variant="contained">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoDialog;
