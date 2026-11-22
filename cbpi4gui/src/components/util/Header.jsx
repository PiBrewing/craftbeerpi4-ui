import Grid from "@mui/material/Grid";
import React from "react";
import Title from "./Title";


const Header = ({ title, children }) => {
    
    return (
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ marginTop: 10 }}
        >
          <Grid item>
            <Title>
              {title}
            </Title>
          </Grid>
          <Grid item>
            {children}
          </Grid>
        </Grid>
    );
  };

  export default Header