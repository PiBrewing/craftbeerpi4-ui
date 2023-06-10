import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { Table, TableBody,  TableHead, TableRow } from "@mui/material";
import { configapi } from "../data/configapi";

const ObsoleteDeleteDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [obsolete, setObsolete] = React.useState([]);
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    configapi.getobsolete((data) => {
      const propertyNames = Object.keys(data);
      setObsolete(propertyNames);
      console.log(propertyNames)
      if (propertyNames.length !== 0) {
        setRender(true)
      }
      else
      {setRender(false)}
    });
  }, [open]);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const no = () => {
    setOpen(false);
  };

  const yes = () => {
    setOpen(false);
    configapi.removeobsolete()
    };

  return (
    <>
      {
        <IconButton aria-label="delete"  onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
      }
      {render ? (
      <Dialog open={open} onClose={no} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">

        <DialogTitle id="alert-dialog-title">Delete Obsolete Config Parameters</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Table>
            <TableHead>
            Do you want to delete the following obsolete config parameters? 
            </TableHead>
            <TableRow>

            </TableRow>
            <TableBody>
              {obsolete.map((key) =>(
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
      </Dialog>) : (
      <Dialog open={open} onClose={no} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">

      <DialogTitle id="alert-dialog-title">Delete Obsolete Config Parameters</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          No obsolete config parameters found. 
          
      </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={no} color="primary" autoFocus variant="contained">
          ok
        </Button>
      </DialogActions>
    </Dialog>

      )}

    </>

  );

};



export default ObsoleteDeleteDialog;
