
import { InputLabel} from "@mui/material"
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useContext } from "react";
import { CBPiContext } from "../data";

 const StepTypeSelect = ({label="Step Type", value, onChange, }) => {
    const { state } = useContext(CBPiContext);

    return <>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            {label}
     </InputLabel>
        <Select variant="standard" fullWidth
            name="type"
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            onChange={onChange}>
                <MenuItem  key="none" value="">---</MenuItem>
            {state.stepTypes.map((item) => <MenuItem  key={item.name} value={item.name}>{item.name}</MenuItem>)}
        </Select>

    </>
}


export default StepTypeSelect