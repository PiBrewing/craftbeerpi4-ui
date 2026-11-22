import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import CachedIcon from "@mui/icons-material/Cached";
import ErrorIcon from "@mui/icons-material/Error";

const StepStateChip = ({ state }) => {
  switch (state) {
    case "I":
      return <Chip label="Inactive" />;
    case "A":
      return <Chip label="Active" icon={<CachedIcon />} color="primary" />;
    case "E":
      return <Chip label="Error" icon={<ErrorIcon />} />;
    case "D":
      return <Chip label="Done" icon={<CheckCircleIcon />} />;
    case "S":
      return <Chip label="Pause" icon={<PauseCircleOutlineIcon />} />;
    default:
      return <Chip label={state} />;
  }
};

export default StepStateChip;
