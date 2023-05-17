import React, { useState } from "react";
import { useNavigate, useNavigation, useLocation } from "react-router-dom";
import BackButton from "../Components/Back/BackButton";
import Background from "../Components/Background/Background";
import { supabase } from "../Store/Supabase";
import { authUserLogin } from "../Store/UserAuth";

function App() {
  const [opponentId, setOpponentId] = useState("");
  const [numRounds, setNumRounds] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();
  const user = JSON.parse(
    decodeURIComponent(location.search.replace("?user=", ""))
  );
  console.log(user);
  const handleStart = async () => {
    //if opponent doesn't exist....
    //search for username in profile
    // Define the username you want to search for

    // Use the select method to search for the row
    const { data, error } = await supabase
      .from("profile")
      .select()
      .eq("id", opponentId);

    // Check if there was an error
    if (error) {
      console.error(error);
      return;
    }

    // Use the data array to access the row(s) that match the search
    if (data.length > 0) {
      //MULTI TODO -----------

      const { data, error } = await supabase
        .from("multMode1")
        .insert({
          user1: user.user.id,
          currentTurn: user.user.id,
          numTurns: numRounds,
        })
        .select();

      var gameID = "";
      if (data != null) {
        gameID = data[0]["id"].toString();
      }

      const gameIDencode = encodeURIComponent(JSON.stringify(gameID));
      const encodedObject = encodeURIComponent(JSON.stringify(user));
      navigation(`../Wait?user=${encodedObject}&gameID=${gameIDencode}`);
    } else {
      setShowPopup(true);
    }
    //else
    //otherwise wait for them to connect
    //navigation('../Wait');
  };

  const userId = user.user.id; // Replace with actual user ID variable

  return (
    <div
      style={{
        backgroundColor: "transparent",
        padding: "1vw",
        height: "100vh",
      }}
    >
      <Background />
      <div
        style={{ display: "flex", justifyContent: "flex-end", fontSize: "3vw" }}
      >
        Your Friend ID: {userId}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1vw",
          fontSize: "5vw",
          color: "#FFF",
        }}
      >
        WELCOME TO MULIPLAYER
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1vw",
          color: "#FFF",
        }}
      >
        <label htmlFor="opponent-id" style={{ fontSize: "4vw" }}>
          Opponent's Friend ID:
        </label>
        <input
          type="text"
          id="opponent-id"
          value={opponentId}
          onChange={(e) => setOpponentId(e.target.value)}
          style={{
            width: "50vw",
            fontSize: "4vw",
            padding: "1vw",
            margin: "1vw 0",
          }}
        />
        <label htmlFor="num-rounds" style={{ fontSize: "4vw" }}>
          Number of rounds:
        </label>
        <select
          id="num-rounds"
          value={numRounds}
          onChange={(e) => setNumRounds(parseInt(e.target.value))}
          style={{
            width: "50vw",
            fontSize: "4vw",
            padding: "1vw",
            margin: "1vw 0",
          }}
        >
          <option value={1}>1 round</option>
          <option value={3}>3 rounds</option>
          <option value={5}>5 rounds</option>
        </select>
        <button onClick={handleStart} className="mode">
          Start
        </button>
      </div>
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "red",
              padding: "5vw",
              borderRadius: "2vw",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "8vw",
                marginBottom: "5vw",
              }}
            >
              This Opponent doesn't Exist! Ask them to check their username or
              sign up!
            </div>
            <button
              onClick={() => setShowPopup(false)}
              style={{ fontSize: "4vw", padding: "1vw", margin: "1vw 0" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <BackButton />
    </div>
  );
}

export default App;

export {};
