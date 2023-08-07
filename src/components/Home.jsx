import React, { useState } from "react";
import Room from "./Room";
import { useNavigate } from "react-router";

const Home = () => {

    const handleSessionNavigation=()=>{
        navigation('/session')
    }

    const navigation = useNavigate();

    const [uniqueId, setUniqueId] = useState("");
    const generateUniqueId = () => {
        let key = "";
        const length = 6;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let counter = 0; counter < length; counter++) {
            key += characters.charAt(Math.floor(Math.random() * charactersLength));

        }
        setUniqueId(key);
    }

    //console.log(generateUniqueId(10));

    return <div>
        <h2>Find a match</h2>
        <button onClick={generateUniqueId}>Create a link</button>
        <button>Copy</button>
        <h4>{uniqueId}</h4>
        <button onClick={handleSessionNavigation}>Start</button>

        <h4>Already have a link? Join the session directly..</h4>
        <input></input>
        <button onClick={handleSessionNavigation}>Join</button>
    </div>
}

export default Home;