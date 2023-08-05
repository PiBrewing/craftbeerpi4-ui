import React from "react";
import { useModel } from "../DashboardContext";
import "../../../rotate.css";

 const CustomSVG = ({ id }) => {
    const model = useModel(id);
    const name = model?.props.name
    const angle = model?.props.rotation || 0
    const width = model?.props?.width || 100
    const height = "auto"
    
    const rotate = "rotate".concat(angle)
    if(name) {
      return <img src={`/dashboard/static/${name}.svg`}  width={width} height={height} className="no-drag"  alt="SVG NOT FOUND" class={rotate}/>
    }
    else{
      return <div>MISSING CONFIG</div>
    }

  };
  
  export default CustomSVG

