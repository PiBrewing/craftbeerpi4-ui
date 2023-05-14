import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import React from "react";

const DeleteDialog = ({ btnText, title, message, callback, id, icon="delete" }) => {
  const [open, setOpen] = React.useState(false);
  const [symbol, setSymbol] = React.useState(<DeleteIcon />)

  React.useEffect(() => {
    if (icon !== "delete") {
      setSymbol(<DeleteSweepIcon />)
    }
  }, [icon]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const no = () => {
    setOpen(false);
  };

  const yes = () => {
    setOpen(false);
    callback(id);
  };

  return (
    <>
      {btnText ? (
        <Button color="secondary" onClick={handleClickOpen} variant="contained" size="small" startIcon={symbol}>
          {btnText}
        </Button>
      ) : (
        <IconButton aria-label="delete"  onClick={handleClickOpen}>
          {symbol}
        </IconButton>
      )}

      <Dialog open={open} onClose={no} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
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

export default DeleteDialog;
