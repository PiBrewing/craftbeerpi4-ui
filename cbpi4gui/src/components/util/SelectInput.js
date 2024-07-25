import { FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

export const SelectInput = ({ label, description="", options=[], value, onChange }) => {

    return (
      <>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          {label}
        </InputLabel>
        <Select variant="standard" size="small" fullWidth labelId="demo-simple-select-label" id="demo-simple-select" value={value} onChange={onChange}>
        <MenuItem key="actor-non" value="">---</MenuItem>
          {options.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{description}</FormHelperText>
      </>
    );
  };
