import { Checkbox, InputAdornment, TextField, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { useContext, useEffect, useState } from "react";
import { useActor } from "../data";
import ActorSelect from "../util/ActorSelect";
import KettleSelect from "../util/KettleSelect";
import FermenterSelect from "../util/FermenterSelect";
import { SelectInput } from "../util/SelectInput";
import SensorSelect from "../util/SensorSelect";
import WidgetSelect from "../util/WidgetSelect";
import { DashboardContext, useModel } from "./DashboardContext";
import { widget_list } from "./widgets/config";
import { Container, Draggable } from "react-smooth-dnd";
import { arrayMove } from "../util/arraymove";
import { ListItemButton } from "@mui/material";

const DashboardLayerListItem = ({ item }) => {
  const { state, actions } = useContext(DashboardContext);
  const selected = state.selected?.id === item.id;

  return (
    <>
    <Draggable key={item.id}>
    <ListItem className="drag-handle" button selected={selected} onClick={() => actions.setSelected(() => ({ type: "E", id: item.id }))}>
      <ListItemText primary={item.name} />
      
    </ListItem>
    </Draggable>
    </>
  );
};

const DashboardLayerList = () => {
  const { state, actions } = useContext(DashboardContext);
  const data = state.elements2;
  const onDrop = ({ removedIndex, addedIndex }) => {
    console.log(removedIndex,addedIndex)
    const data = arrayMove(state.elements2, removedIndex, addedIndex)
    actions.setElements2((current) => [...data])
  };


  return (
    <>
      <div className="section_header">Layer</div>
      <div
        style={{
          padding: 5,
          scrollbarColor: "dark",
          maxHeight: 300,
          overflowY: "scroll",
        }}
      >
        <List component="nav" disableGutters={true} dense >
        <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
          {data.map((e, index) => (
            <DashboardLayerListItem key={index} item={e} />
          ))}
           </Container>
        </List>
        
      </div>
    </>
  );
};

const DashboardLayer = () => {
  return (
    <>
    <div>
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="box"
        style={{
          width: 240,
          overflow: "hidden",
          fontFamily: "JetBrains Mono",
          backgroundColor: "#2c282e",
          color: "#fff",
          borderRadius: 5,
        }}
      >
        <div className="handle">
          <b>Settings</b>
        </div>

        <DashboardLayerList />

        <DashboardProps />
      </div>
    </div>
    </>
  );
};

const PropsEditor = ({ data }) => {
  const { state, actions } = useContext(DashboardContext);
  const selected_id = state.selected?.id;
  if (!data || !selected_id) {
    return "";
  }
  const type_spec = widget_list.find((item) => item.type === data.type);


  const handlechange = (e, key) => {
    actions.update_prop(selected_id, key, e.target.value);
  };

  const handlechange_number = (e, key) => {
    
    actions.update_prop(selected_id, key, parseInt(e.target.value));
  };


  return type_spec.props.map((s) => {
    const unit = s.unit ? { endAdornment: <InputAdornment position="end">{s.unit}</InputAdornment> } : {};

    switch (s.type) {
      case "text":
        return <TextField variant="standard" InputProps={unit} label={s.name} key={s.name} fullWidth onChange={(e) => handlechange(e, s.name)} value={data.props[s.name]} />;
      case "number":
          return <TextField variant="standard" type="number" InputProps={unit} label={s.name} key={s.name} fullWidth onChange={(e) => handlechange_number(e, s.name)} value={data.props[s.name]} />;
      case "select":
        return <SelectInput label={s.name} value={data.props[s.name]} key={s.name} onChange={(e) => handlechange(e, s.name)} options={s?.options || []} />;
      case "actor":
        return <ActorSelect value={data.props[s.name]} key={s.name} onChange={(e) => handlechange(e, s.name)} />;
      case "sensor":
        return <SensorSelect value={data.props[s.name]} key={s.name} onChange={(e) => handlechange(e, s.name)} />;
      case "kettle":
        return <KettleSelect fullWidth value={data.props[s.name]} key={s.name} onChange={(e) => handlechange(e, s.name)} />;
      case "fermenter":
        return <FermenterSelect fullWidth value={data.props[s.name]} key={s.name} onChange={(e) => handlechange(e, s.name)} />;
      case "widget":
        return <WidgetSelect label={s.name} value={data.props[s.name]} key={s.name} onChange={(e) => handlechange(e, s.name)} />;
      default:
        return "";
    }
  });
};

const PathSettingsItem = ({ item, checked, handleToggle }) => {
  return (
    <>
    <ListItemButton onClick={handleToggle(item.id)}>
      <ListItemIcon>
        <Checkbox edge="start" checked={checked.indexOf(item.id) !== -1} tabIndex={-1} color="primary" disableRipple inputProps={{ "aria-labelledby": "A" }} />
      </ListItemIcon>
      <ListItemText primary={item.name} />

    </ListItemButton>
    </>
  );
};

const PathSettings = () => {
  const { state, actions } = useContext(DashboardContext);
  const actor = useActor();
  const selected_id = state.selected?.id;
  const [selectedType, setSelectedType] = useState(null);
  const [checked, setChecked] = React.useState([]);
  const [checkedRight, setCheckedRight] = React.useState([]);

  useEffect(() => {
    const item = state.pathes.find((e) => e.id === selected_id);
    setChecked((current) => item?.condition?.left || []);
    setCheckedRight((current) => item?.condition?.right || []);
  }, [selected_id]);

  const handleToggle = (value, direction = "left") => () => {
    if (direction === "left") {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
      actions.update_path_condition(selected_id, newChecked, checkedRight,direction);
    } else {
      const currentIndex = checkedRight.indexOf(value);
      const newChecked = [...checkedRight];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setCheckedRight(newChecked);
      actions.update_path_condition(selected_id, checked, newChecked,direction);
    }
  };

    // Handle change of the boolean expression for path animation.
    const handleChange = (e, direction) => {
      if (direction === "left")
      {
        console.log("Changement exp left")
        actions.update_path_condition_exp(selected_id, "leftExpression", e.target.value);
      }
      else{
        console.log("Changement exp left")
        actions.update_path_condition_exp(selected_id, "rightExpression", e.target.value);
      }
    };

    const handleChangeWidth = (e, property) => {
      if (property === "width"){
        actions.update_path_width(selected_id, e.target.value);
      }
    };

  useEffect(() => {
    setSelectedType(() => state.selected?.type);
  }, [state.selected]);

  if (selectedType !== "P") {
    return "";
  }

  const item = state.pathes.find((e) => e.id === selected_id);

  // Add a TextField for adding the booleanExpression
    var helperTextExpression = <>sample expression ("" are mandatory for identifying actors): ("actor1" && "actor2") || ("actor2" && "actor3") <br /> don't forget the quote<br /><br /></>
   

  return (
    <>
      <div
        style={{
          padding: 5,
          scrollbarColor: "dark",
          maxHeight: 300,
          overflowY: "scroll",
        }}
      >
        Width
        <TextField variant="standard" type="number" label="Path width" fullWidth value={item?.condition?.stroke} InputProps={{inputProps: { max: 50, min: 1 }}} onChange={(e) => handleChangeWidth(e, "width")} />

        Flow Left
        <List disableGutters={true} dense component="nav" aria-label="main mailbox folders">
          {actor.map((item) => (
            <PathSettingsItem item={item} checked={checked} handleToggle={handleToggle} />
          ))}
        </List>
        <TextField variant="standard" label="Condition expression for left" helperText={helperTextExpression} fullWidth value={item?.condition?.leftExpression} onChange={(e) => handleChange(e, "left")} />

        Flow Right
        <List disableGutters={true} dense component="nav" aria-label="main mailbox folders">
          {actor.map((item) => (
            <PathSettingsItem item={item} checked={checkedRight} handleToggle={(id) => handleToggle(id, "right")} />
          ))}
        </List>
        <TextField variant="standard" label="Condition expression for right" helperText={helperTextExpression} fullWidth value={item?.condition?.rightExpression} onChange={(e) => handleChange(e, "right")} />
      </div>
    </>
  );
};

export const DashboardProps = () => {
  const { state, actions } = useContext(DashboardContext);
  const selected_id = state.selected?.id;
  const data = useModel(selected_id);

  const handleChange = (e, key) => {
    actions.update_default_prop(selected_id, key, e.target.value);
  };
  const render_form = (data) => {
    if (!data) {
      return "";
    }

    return ( <> <TextField variant="standard" label="Name" fullWidth value={data?.name} onChange={(e) => handleChange(e, "name")} /> </>);
  };

  return (
    <>
    <div onPointerDown={(e) => e.stopPropagation()}>
      <div className="section_header">Properties</div>
      <div style={{ padding: 10 }}>
        {render_form(data)}

        <PropsEditor data={data} />
        <PathSettings />
        <Typography variant="caption" display="block" gutterBottom>
          {data?.x || "0"}px / {data?.y || "0"}px
        </Typography>
      </div>
    </div>
    </>
  );
};

export default DashboardLayer;
