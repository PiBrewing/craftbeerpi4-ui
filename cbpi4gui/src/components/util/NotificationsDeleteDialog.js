import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Table, TableBody,  TableHead, TableRow } from "@mui/material";
import { useCBPi } from "../data";
import Badge from "@mui/material/Badge";
import { notificationapi } from "../data/notificationapi";

const NotificationsDeleteDialog = () => {
  const { state } = useCBPi();
  const [open, setOpen] = React.useState(false);
  
  let [notifications, setNotifications] = React.useState([]);
  const [render, setRender] = React.useState(false);

  //console.log(notifications)
  
  React.useEffect(() => {
    setNotifications(state.allnotifications)
  },[state.allnotifications]);

  
  React.useEffect(() => {
    if (notifications?.length !== 0) {
        setRender(true)
      }
      else
      {setRender(false)}
    }, [open]);



  const handleClickOpen = () => {
      setOpen(true);
  };

  const no = () => {
    setOpen(false);
  };

  const yes = () => {
    setOpen(false);
    notificationapi.deletenotifications()
    };

  return (
    <>
      {
        <IconButton aria-label="delete"  onClick={handleClickOpen} color='inherit'>
          <Badge badgeContent={notifications?.length || 0} color="secondary">
          <NotificationsIcon />
          </Badge>
        </IconButton>
      }
      {render ? (
      <Dialog open={open} onClose={no} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">

        <DialogTitle id="alert-dialog-title">Delete Old Notifications ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Table>
            <TableBody>
              {notifications.map((key) =>(
              <TableRow>
              {key}  
              </TableRow>))}
              </TableBody> 
        </Table>

        </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={no} color="secondary" autoFocus variant="contained">
            No
          </Button>
          <Button onClick={yes} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>) : (false)}
          </>
  );
};

export default NotificationsDeleteDialog;
