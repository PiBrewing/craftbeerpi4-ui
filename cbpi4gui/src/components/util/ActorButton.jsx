import { Button } from "@mui/material";
import { useCBPi } from "../data";


 const ActorButton = ({label = "Actor", id, property="name"}) => {
    const { state } = useCBPi()
    const actor = state.actors.find(e => e.id === parseInt(id))
    return actor ? (<Button>{actor.state ? "ON" : "OFF"}</Button>) : (<>Actor not found</>)
}

export default ActorButton