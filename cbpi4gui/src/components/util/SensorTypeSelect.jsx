
import { InputLabel} from "@mui/material"
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useCBPi } from "../data";


 const SensorTypeSelect = ({label="Sensor Type", value, onChange, }) => {
    const { state } = useCBPi()
    return <>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            {label}
     </InputLabel>
        <Select variant="standard" fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size="small"
            value={value}
            onChange={onChange}>
                <MenuItem  key="none" value="">---</MenuItem>
            {state.sensorTypes.map((item) => <MenuItem  key={item.name} value={item.name}>{item.name}</MenuItem>)}
        </Select>
    </>
}


export default SensorTypeSelect