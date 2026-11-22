import { TextField } from "@mui/material";
import { default as React } from "react";

export const BasicData = ({data, setData}) => {


  const handleChange = (event) => {
    const values = {...data};
    values[event.target.name] = event.target.value;
    setData({...values});
  }
  return (
    <>
      <TextField variant="standard" fullWidth name="name" value={data.name} onChange={handleChange}  id="name" label="Name" />
      {/*<TextField variant="standard"fullWidth name="author" value={data.author} onChange={handleChange}  id="author" label="Author" />*/}
      <TextField variant="standard" name="desc" fullWidth multiline value={data.desc} onChange={handleChange} id="desc" label="Description" />
    </>
  );
};
