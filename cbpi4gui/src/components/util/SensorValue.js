import {  useCBPi } from "../data";
import Moment from 'react-moment';


 const SensorValue = ({id, digits}) => {
    const { state } = useCBPi();
    const data = state?.sensorData[id];
    const datatype = state?.sensorDataType[id];
    if (!datatype || datatype === "value") {
        if ((digits === "N/A" ) || (digits === undefined)) {
            return data !== undefined ? (<>{data}</>) : (<>---</>)
            }
        else {
            return data !== undefined ? (<>{data.toFixed(parseInt(digits))}</>) : (<>---</>)
            }
        }
    else if (datatype === "datetime") {
        return data !== undefined ? (<Moment format="YYYY-MM-DD HH:mm" unix>{parseInt(data)}</Moment>) : (<>---</>)
    }
    else if (datatype === "string") {
        return data !== undefined ? (<>{data}</>) : (<>---</>)
    }
    }

export default SensorValue