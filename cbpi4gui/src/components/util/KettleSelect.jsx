import {FormHelperText, InputLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useContext } from "react";
import { CBPiContext } from "../data";

const KettleSelect = ({ label = "Kettle", description="", value, onChange, fullWidth=false}) => {
  const { state } = useContext(CBPiContext);

  return (
    <>
      {label ? (<InputLabel shrink id="demo-simple-select-placeholder-label-label">
        {label}
      </InputLabel>): ""}
      
      <Select variant="standard" size="small" fullWidth={fullWidth} labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={onChange}>
      <MenuItem key="actor-non" value="">---</MenuItem>
        {state.kettle.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{description}</FormHelperText>
    </>
  );
};

export default KettleSelect;
