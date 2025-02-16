
import React from "react";
import { useEffect, useState } from "react";
import { useActor } from "../../data";
import { useModel } from "../DashboardContext";
import { Tooltip } from "@mui/material";
import ActorSelect from "../../util/ActorSelect";
export const Led = ({ id }) => {
    const model = useModel(id)
    const actor = useActor(model.props?.actor)
    const [color, setColor] = useState(model.props.color || "green");
    useEffect(() => {
      setColor(model.props.color);
        
    }, [model.props.color]);

    let actortitle=actor?.name ? actor.name : "No Actor Selected"


    let led_state = actor?.state ? "led-" + color : "led-" + color + "-off "
    return (
    <Tooltip title={actortitle + " - " + (actor?.state ? "ON" : "OFF")} placement="top">
    <div className={led_state}></div>
    </Tooltip>
    )
    
  };
  