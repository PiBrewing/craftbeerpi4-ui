import { FormHelperText, InputLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useContext } from "react";
import { CBPiContext } from "../data";

const SensorSelect = ({ label = "Sensor", description="", value, onChange }) => {
  const { state } = useContext(CBPiContext);

  return (
    <>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
        {label}
      </InputLabel>
      <Select variant="standard" size="small" fullWidth labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={onChange}>
        <MenuItem key="sensor-non" value={""}>
          ---
        </MenuItem>
        {state.sensors.map((item) => (
          <MenuItem key={item.name} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{description}</FormHelperText>
    </>
  );
};

export default SensorSelect;
