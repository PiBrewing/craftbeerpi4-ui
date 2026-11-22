
import { InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDashboard } from "../dashboard/DashboardContext";


 const WidgetSelect = ({label, value, key, onChange, }) => {
    const { state } = useDashboard()
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
            {state.widgets.map((item,index) => <MenuItem  key={index} value={item}><img src={`/dashboard/static/${item}.svg`}  width={48} height="auto" className="no-drag"  alt="---" style={{margin: '0px 5px'}}/>{item}</MenuItem>)}
        </Select>
    </>
}


export default WidgetSelect