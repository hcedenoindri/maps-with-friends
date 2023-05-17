import React, { useState } from "react";
import { useNavigate, useNavigation, useLocation } from "react-router-dom";
import Background from "../Components/Background/Background";
import { supabase } from "../Store/Supabase";
import { authUserLogin } from "../Store/UserAuth";

//TODO MULTISIGNIN -------
//make sign in screen that works, [todo]
//change p2connect variable to true [done]
//pass user and game id to waiting and redirect [done]

function App() {
  const navigation = useNavigate();
  const location = useLocation();
  const gameID = JSON.parse(
    decodeURIComponent(location.search.replace("?gameID=", ""))
  );
  console.log(gameID);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [user, setUser] = useState({});

  const handleLogin = async () => {
    const dummyFunction = async () => {
      //auth user using email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error("Invalid username or password!");
      } else {
        return data;
      }
      // if () { //if user contains the right data

      // } else {
      //   throw new Error('Invalid username or password!');
      // }
    };

    try {
      const user = await dummyFunction();
      setUser(user);
      console.log("Hello world");
      const gameIDencode = encodeURIComponent(JSON.stringify(gameID));
      const encodedObject = encodeURIComponent(JSON.stringify(user));
      //check if p2 is p1... TODO -------------------
      if (user.user !== null) {
        const { data, error } = await supabase
          .from("multMode1")
          .update({ P2Connect: true, user2: user.user.id })
          .eq("id", gameID);
        navigation(`../wait2?user=${encodedObject}&gameID=${gameIDencode}`);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
      }}
    >
      <Background />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: "20px", color: "#FFF" }}>
          Login
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            margin: "5px",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            margin: "5px",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
          }}
        />
        <button onClick={handleLogin} className="mode">
          Login
        </button>
        {showError && (
          <p style={{ color: "red" }}>Invalid username or password!</p>
        )}
      </div>
    </div>
  );
}

export default App;

export {};
