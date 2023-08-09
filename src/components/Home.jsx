import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

const Home = () => {
    // handle navigation to Room page
    const navigation = useNavigate();
    const handleSessionNavigation = () => {
        navigation(`/session/${uniqueId}`)
    }


    // generate unique session id
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

    // when the other user joins via same unique id
    const [inputUniqueId, setInputUniqueId] = useState("");
    const getUniqueIdFromInput = (e) => {
        setInputUniqueId(e.target.value)

    }

    // navigation for 2nd user
    const navigationUser2 = useNavigate();
    const handleSessionNavigationUser2 = () => {
        navigationUser2(`/session/${inputUniqueId}`)
    }

    return <div>
        <h2>Find a match</h2>
        <button onClick={generateUniqueId}>Create a link</button>
        <button>Copy</button>
        <h4>{uniqueId}</h4>
        <button onClick={handleSessionNavigation}>Start</button>
        {/*conditional rendering of elems when the user is the creator of session */}

        {!uniqueId &&
            < div className="joinee">
                <h4>Already have a link? Join the session directly..</h4>
                <input onChange={getUniqueIdFromInput} value={inputUniqueId}></input>
                <button onClick={handleSessionNavigationUser2}>Join</button>
            </div>
        }
    </div >
}

export default Home;