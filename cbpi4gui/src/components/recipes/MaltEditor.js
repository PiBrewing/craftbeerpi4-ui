import { Divider, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../util/Header";

export const MaltEditor = ({items =[], setItems = ()=>{} }) => {
  const add_entry = () => {
    console.log("ADD");
    setItems([...items, { name: "", amount: 0 }]);
  };

  const remove_entry = (index) => {
    const values = [...items];
    const filteredItems = values.slice(0, index).concat(values.slice(index + 1, values.length));
    setItems(filteredItems);
  };

  const handleInput = (index, event) => {
    const values = [...items];

    values[index][event.target.name] = event.target.value;
    setItems([...values]);
  };

  const get_total = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  };
  return (
    <>
      <Header title="Malts">
        <IconButton onClick={add_entry}>
          <AddCircleIcon />
        </IconButton>
      </Header>
      <Divider />
      <Grid container spacing={3}>
        {items.map((item, index) => {
          return (
            <>
              <Grid item xs={12} sm={7}>
                <TextField variant="standard" fullWidth label="name" name="name" value={item.name} onChange={(e) => handleInput(index, e)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                  }}
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleInput(index, e)}
                />
              </Grid>

              <Grid item xs={12} sm={1}>
                <IconButton aria-label="delete" onClick={() => remove_entry(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </>
          );
        })}
        <Grid item xs={12} >
        Total: {get_total()}
        </Grid>
      </Grid>

    
    </>
  );
};
