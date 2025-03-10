import { Button, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import React from "react";
import CalculateIcon from '@mui/icons-material/Calculate';

const DeleteDialog = ({ btnText, title, message, callback, id, Spindle_Name ,tooltip="Delete", icon="delete" }) => {
  const [open, setOpen] = React.useState(false);
  const [symbol, setSymbol] = React.useState(<DeleteIcon />)
  const [tip, setTip] = React.useState(tooltip)

  React.useEffect(() => {
    if (icon !== "delete" && icon !== "Calibrate") {
      setSymbol(<DeleteSweepIcon />)
      setTip(tooltip)
    }
    else if (icon === "Calibrate") {
      setSymbol(<CalculateIcon />)
      setTip(tooltip)}
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
        <Tooltip title={tip}>
        <Button color="secondary" onClick={handleClickOpen} variant="contained" size="small" startIcon={symbol}>
          {btnText}
        </Button>
        </Tooltip>
      ) : (
        <Tooltip title={tip}>
        <IconButton aria-label="delete"  onClick={handleClickOpen}>
          {symbol}
        </IconButton>
        </Tooltip>
      )}

      <Dialog open={open} onClose={no} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message} {Spindle_Name}</DialogContentText>
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
