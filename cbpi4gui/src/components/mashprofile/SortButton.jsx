import { IconButton } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { default as React } from "react";

const SortButton = ({ index, length, id, moveCallback }) => {
  if (length <= 1) {
    return (
      <>
        <IconButton aria-label="delete" size="small" disabled>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton aria-label="delete" size="small" disabled>
          <ArrowDownwardIcon />
        </IconButton>
      </>
    );
  } else if (index === 0) {
    return (
      <>
        <IconButton aria-label="delete" size="small" disabled>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            moveCallback(id, 1);
          }}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </>
    );
  } else if (index + 1 === length) {
    return (
      <>
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            moveCallback(id, -1);
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton aria-label="delete" size="small" disabled>
          <ArrowDownwardIcon />
        </IconButton>
      </>
    );
  } else {
    return (
      <>
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            moveCallback(id, -1);
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            moveCallback(id, 1);
          }}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </>
    );
  }
};

export default SortButton;
