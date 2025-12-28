import { styled } from '@material-ui/core/styles';
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CBPiContext } from "../data";
import { sensorapi } from "../data/sensorapi";
import DeleteDialog from "../util/DeleteDialog";
import SensorValue from "../util/SensorValue";

const PREFIX = 'SensorTable';

const classes = {
  table: `${PREFIX}-table`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.table}`]: {
    minWidth: 650,
  },
});

const SensorTable = () => {

  const navigate = useNavigate();
  const { state, actions } = useContext(CBPiContext);

  const remove_callback = (id) => {
    sensorapi.remove(id);
    actions.delete_sensor(id);
  };

  function OneWireID(sensor) {
    return sensor.props.Sensor ? sensor.props.Sensor : ""
  };
  

  return (
    (<Root>
      <TableContainer component={Paper}>
        <Table className={classes.table} dense table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right" className="hidden-xs">
                Type
              </TableCell>
              <TableCell align="right" className="hidden-xs">
                OneWire ID
              </TableCell>
              <TableCell align="right" className="hidden-xs">
                Sensor ID
              </TableCell>
              <TableCell align="right" className="hidden-xs">
                Value
              </TableCell>
              <TableCell align="right" className="hidden-xs">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.sensors.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  {row.type}
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  {OneWireID(row)}
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  {row.id} 
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <SensorValue id={row.id} digits={1} />
                </TableCell>
                <TableCell align="right" className="hidden-xs">
                  <DeleteDialog title="Delete Sensor" message="Do you want to delete the Sensor" id={row.id} callback={remove_callback} />
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      navigate("/sensor/" + row.id);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>)
  );
};

export default SensorTable;
