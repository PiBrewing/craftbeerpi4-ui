import React from "react";
import { useModel } from "../DashboardContext";
import { useEffect, useState } from "react";
import { useActor } from "../../data";
import "../../../rotate.css";

 const CustomSVG = ({ id }) => {
    const model = useModel(id);
    const actor = useActor(model?.props.actor);
    const [name, setName] = useState(actor?.state ? model?.props.WidgetOn : model?.props.WidgetOff)
    const angle = model?.props.rotation || 0;
    const width = model?.props?.width || 100;
    const height = "auto"
    const rotate = "rotate".concat(angle)

    useEffect(() => {
      if (actor?.state){
      setName(model?.props.WidgetOn || model?.props.WidgetOff)}
      else {
        setName(model?.props.WidgetOff)
      }       
    }, [actor?.state]);

    if(name) {
      return <img src={`/dashboard/static/${name}.svg`}  width={width} height={height} className="no-drag"  alt="SVG NOT FOUND" class={rotate}/>
    }
    else{
      return <div>MISSING CONFIG</div>
    }

  };
  
  export default CustomSVG

