import { default as React } from "react";
import SensorValue from "../../util/SensorValue";
import { useModel } from "../DashboardContext";


export const SensorData = ({ id }) => {
    const model = useModel(id);
    const sensor_id = model?.props?.sensor;
    const sensor_digits = model?.props?.digits;
    const css_style = { color: model?.props?.color || "#fff", fontSize: `${model?.props?.size}px` };
    return sensor_id ? (<div style={css_style}><SensorValue id={sensor_id} digits={sensor_digits} />{model.props?.unit}</div>) : "MISSING CONFIG";
  };