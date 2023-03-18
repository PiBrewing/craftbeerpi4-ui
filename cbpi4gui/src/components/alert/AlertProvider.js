import { makeStyles } from "@mui/styles";
import Alert from "@mui/material/Alert";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import buzzer from './buzzer.mp3';
import {configapi} from '../data/configapi'
import { notificationapi } from "../data/notificationapi";

export const ActionDialog = ({ item }) => {
  const alert = useAlert();

  const call_action = (dialog_id, action) => {
    alert.remove(dialog_id);
    notificationapi.action(dialog_id, action, (data) => {
      console.log(data);
    });
  };

  return (
    <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{item.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{item.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {item.action.map((a) => {
          return (
            <Button onClick={() => call_action(item.id, a.id)} color="primary">
              {a.label}
            </Button>
          );
        })}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: 10,
    right: 30,
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
}));

export const AlertContext = createContext({});

export const AlertProvider = ({ children }) => {
  const classes = useStyles();
  const [alerts, setAlerts] = useState([]);
  const audio = new Audio(buzzer);

  const remove = useCallback((id) => {
    setAlerts((value) => {
      return value.filter((a) => a.id !== id);
    });
  }, []);

  const show = useCallback((id, title = "", message = "", type = "info", action = null, timeout = 5000) => {
    const alert = {
      id,
      title,
      message,
      type,
      action,
    };

    configapi.getone('PLAY_BUZZER', (data) => {
      if (data){
        if (data ==="Yes"){
          audio.play();
          }
         }
        });



    if (action?.length <= 0) {
      const timerId = setTimeout(() => {
        remove(id);
      }, timeout);
    }
    setAlerts((state) => state.concat(alert));
    return alert;
  }, []);

  const value = {
    alerts,
    show,
    remove,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}

      <div className={classes.root}>
        {alerts.map((a) => {
          if (a?.action?.length > 0) {
            return <ActionDialog key={a.id} item={a} />;
          } else { 
            return <Alert severity={a.type || "info"} key={a.id}>{a.title} - {a.message}</Alert>;
          }
        })}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = (Context) => {
  const alertContext = useContext(AlertContext);
  const alert = useMemo(() => {
    return alertContext;
  }, [alertContext]);
  return alert;
};
