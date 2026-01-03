import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useCBPi } from '../data';
import ActorValue from '../util/ActorValue';
import DeleteDialog from '../util/DeleteDialog';
import SensorValue from '../util/SensorValue';

const PREFIX = 'KettleTable';

const classes = {
    table: `${PREFIX}-table`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
    [`& .${classes.table}`]: {
        minWidth: 650,
    },
});

const KettleTable = () => {

    const navigate = useNavigate();
    const { state, actions } = useCBPi()

    const remove_callback = (id) => {
        actions.delete_kettle(id)
    }
    return (
        (<Root>
            <TableContainer >
                <Table className={classes.table} dense table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right" className="hidden-xs">Logic</TableCell>
                            <TableCell align="right" className="hidden-xs">Heater</TableCell>
                            <TableCell align="right" className="hidden-xs">Agitator</TableCell>
                            <TableCell align="right" className="hidden-xs">Sensor</TableCell>
                            <TableCell align="right" className="hidden-xs">Target Temp</TableCell>
                            <TableCell align="right" className="hidden-xs">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.kettle.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    
                                        {row.name}
                                    
                                </TableCell>
                                <TableCell align="right" className="hidden-xs">{row.type}</TableCell>
                                <TableCell align="right" className="hidden-xs"><ActorValue id={row.heater}/></TableCell>
                                <TableCell align="right" className="hidden-xs" ><ActorValue id={row.agitator}/></TableCell>
                                <TableCell align="right" className="hidden-xs"><SensorValue id={row.sensor} digits={1}/></TableCell>
                                <TableCell align="right" className="hidden-xs">{row.target_temp}</TableCell>
                                <TableCell align="right" className="hidden-xs">
                                    <DeleteDialog title="Delete Kettle" message="Do you want to delete" id={row.id} callback={remove_callback} />
                                    <IconButton aria-label="delete" size="small" onClick={() => { navigate("/kettle/"+row.id) }} >
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
}

export default  KettleTable