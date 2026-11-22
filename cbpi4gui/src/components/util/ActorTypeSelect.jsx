
import { InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { CBPiContext, useCBPi } from "../data";


 const ActorTypeSelect = ({label="Logic", value, onChange, }) => {
    const { state } = useCBPi(CBPiContext);
    return <>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            {label}
     </InputLabel>
        <Select variant="standard" fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            size="small"
            onChange={onChange}>
                <MenuItem  key="none" value="">---</MenuItem>
            {state.actorTypes.map((item) => <MenuItem  key={item.name} value={item.name}>{item.name}</MenuItem>)}
        </Select>
    </>
}


export default ActorTypeSelect