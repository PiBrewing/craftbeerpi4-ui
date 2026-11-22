import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BallotIcon from '@mui/icons-material/Ballot';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import InfoIcon from '@mui/icons-material/Info';
import PowerIcon from '@mui/icons-material/Power';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ComputerIcon from '@mui/icons-material/Computer';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { ListItemButton } from '@mui/material';
import { useCBPi } from '../data';

const MenuItem = ({ onClose, label, path = "/", children }) => {
    const navigate = useNavigate();


    const goTo = (key) => {
        navigate(key);
        onClose()
    }

    return <><ListItemButton onClick={()=>goTo(path)}>
        <ListItemIcon>
            {children}
        </ListItemIcon>
        <ListItemText primary={label} />
     
    </ListItemButton>
    
    </>
}


const Menu = ({onClose}) => {
    const {state} = useCBPi()
    return <List>
        <MenuItem onClose={onClose} label="Dashboard"><DashboardIcon /></MenuItem>
        <MenuItem onClose={onClose} label="Mash Profile" path="/mashprofile"><BallotIcon /></MenuItem>
        <MenuItem onClose={onClose} label="Fermenter Profile" path="/fermenterprofile"><BallotIcon /></MenuItem>
        <MenuItem onClose={onClose} label="Hardware" path="/hardware"><DeveloperBoardIcon /></MenuItem>
        <MenuItem onClose={onClose} label="Settings" path="/settings/All"><SettingsIcon /></MenuItem>
        <MenuItem onClose={onClose} label="Analytics" path="/charting"><TimelineIcon /></MenuItem>
        {state.spindledata? <MenuItem onClose={onClose} label="Spindle Data" path="/currentdata"><TroubleshootIcon /></MenuItem> : ""}
        <MenuItem onClose={onClose} label="Plugins" path="/plugins"><PowerIcon /></MenuItem>
        <MenuItem onClose={onClose} label="Recipe Upload" path="/upload"><CloudUploadIcon /></MenuItem>
        <MenuItem onClose={onClose} label="System" path="/system"><ComputerIcon /></MenuItem>
        <MenuItem onClose={onClose} label="About" path="/about"><InfoIcon /></MenuItem>
    </List>
}

export default Menu

