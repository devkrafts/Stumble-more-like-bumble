import React from "react";

const Room = () => {
    return <div>
        <h4>Waiting for User1 to join...</h4>
        <h3>Anushka is online</h3>
        <h3>Enter your display name</h3>
        <input></input>
        <button>Start swiping</button>
        <h3>Allow location </h3>
        <h3>Select an activity</h3>
        <select>
            <option value="cafes">Cafes</option>
            <option value="restaurant">Restaurant</option>
            <option value="clubs">Clubs/Pubs</option>
            <option value="attractions">Attractions</option>
        </select>
    </div>
}

export default Room;