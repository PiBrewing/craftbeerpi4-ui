
import { InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useCBPi } from "../data";


 const LogicSelect = ({label="Logic", value, onChange, }) => {
    const { state } = useCBPi()
    return <>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            {label} {value}
     </InputLabel>
        <Select variant="standard" fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size="small"
            value={value}
            onChange={onChange}>
                <MenuItem  key="none" value="">---</MenuItem>
            {state.logic.map((item) => <MenuItem  key={item.name} value={item.name}>{item.name}</MenuItem>)}
        </Select>
    </>
}


export default LogicSelect