import React, { FC, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  useNavigate,
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./Game.css";
import ReactMapGL from "react-map-gl";
import User from "../Components/UserUI/User";
import GMap from "../GMap/GMap";

import { supabase } from "../Store/Supabase";
import BackButton from "../Components/Back/BackButton";
import PlayAgainButton from "../Components/PlayAgain/PlayAgainButton";
import { openai } from "./chatgpt";
import { type } from "os";
import { Loader } from "../Components/Loader";
import Timer from "./Timer";

async function getCoordinates(): Promise<{ lat: string; lng: string }> {
  var lat = "40.457375";
  var lng = "-80.009355";

  // console.log("hello");
  var randInt = Math.floor(Math.random() * 5000);

  const { data, error } = await supabase
    .from("acceptedLocs")
    .select()
    .eq("id", randInt);
  if (data != null) {
    lat = data[0]["lat"].toString();
    lng = data[0]["lng"].toString();
  }

  return { lat, lng };
}

async function getHint(continent: string) {
  var hint = ["No hint..."];
  var history = ["No history hint..."];

  if (
    continent != "North America" &&
    continent != "South America" &&
    continent != "Europe" &&
    continent != "Asia" &&
    continent != "Africa" &&
    continent != "Antarctica" &&
    continent != "Oceania"
  ) {
    return { hint, history };
  }

  const { data, error } = await supabase
    .from("continentalHints") 
    .select()
    .eq("continent", continent);

  if (data != null) {
    // console.log(data[0]["general_fact"]);
    hint = [];
    hint.push(data[0]["general_fact"]);
    hint.push(data[1]["general_fact"]);
    hint.push(data[2]["general_fact"]);

    // console.log(data[0]["history_fact"]);
    history = [];
    history.push(data[0]["history_fact"]);
    history.push(data[1]["history_fact"]);
    history.push(data[2]["history_fact"]);
  }

  return { hint, history };
}

const Game: FC = (): JSX.Element => {
  const location = useLocation();
  const navigation = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get("user")
    ? JSON.parse(queryParams.get("user")!)
    : null;
  const gameID = queryParams.get("gameID")
    ? JSON.parse(queryParams.get("gameID")!)
    : null;

  //TODO MULTIPLAYER-----------------

  //set points equal to the row (corresponding to which player we are) in game id [todo]
  //set currentTurn variable to other player [done]
  //redirect to waiting.tsx [done]

  //Also like, we should probably have user1 set a coordinates variable so both players have a fair map [optional]
  async function setScoremp(player: boolean, score: number) {
    if (player == true) {
      const { data, error } = await supabase
        .from("multMode1")
        .update({ score1: score }) //also update score of current player
        .eq("id", gameID);
    } else {
      const { data, error } = await supabase
        .from("multMode1")
        .update({ score2: score }) //also update score of current player
        .eq("id", gameID);
    }
  }

  //Also like, we should probably have user1 set a coordinates variable so both players have a fair map [optional]
  async function mpComponent() {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    var score = Math.round(getScore()).toFixed(1);
    console.log("Hello");
    const gameIDencode = encodeURIComponent(JSON.stringify(gameID));
    const encodedObject = encodeURIComponent(JSON.stringify(user));
    //check if p2 is p1... TODO -------------------
    const { data, error } = await supabase
      .from("multMode1")
      .select()
      .eq("id", gameID);
    var otherPlayer = "";
    if (data) {
      if (user.user.id == data[0]["user1"]) {
        otherPlayer = data[0]["user2"];
        await setScoremp(true, parseInt(data[0]["score1"]) + parseInt(score));
      } else {
        otherPlayer = data[0]["user1"];
        await setScoremp(false, parseInt(data[0]["score2"]) + parseInt(score));
      }
    }
    if (user.user !== null) {
      const { data, error } = await supabase
        .from("multMode1")
        .update({ currentTurn: otherPlayer }) //also update score of current player
        .eq("id", gameID);
      navigation(`../wait2?user=${encodedObject}&gameID=${gameIDencode}`);
    }
  }

  const [iframeSrc, setIframeSrc] = useState("");   // holds game generated coordinates.
  const [isGameDone, changeGameDone] = useState(false);
  const [isGameLost, setGameLost] = useState(false);
  const [chosenLatLon, changeLatLon] = useState({ lat: 0, lon: 0 });
  const [isClicked, setIsClicked] = useState(false);

  const [isTimerDone, setTimerDone] = useState(false);
  const [timerKey, setTimerKey] = useState(setTimeout(()=>{}, 0));

  const [genHint, setGenHint] = useState(["Sorry, No hint for this place ..."]);
  const [factCount, setFactCount] = useState(-1);
  const [hintRequested, setHintRequested] = useState(false); // general hint bool
  const [hintRequested3, setHintRequested3] = useState(""); // chatGPT hint bool

  const [historyHint, setHistoryHint] = useState([
    "Sorry, No history hint for this place...",
  ]);
  const [histCount, setHistCount] = useState(-1);
  const [hintRequested2, setHintRequested2] = useState(false); // history hint bool

  const [selectedLocation, setSelectedLocation] = useState("");
  const [correctLocation, setCorrectLocation] = useState("");

  const [howToPlay, setHowToPlay] = useState(false);

  useEffect(() => {
    if (chosenLatLon.lat !== 0) {
      changeGameDone(true);
      clearInterval(timerKey);
      mpComponent();
    }

    if (isTimerDone) {
      setGameLost(true);
    }
  }, [chosenLatLon, isTimerDone]);    // end of use effect

  useEffect(() => {
    async function getIframeSrc() {
      let { lat, lng } = await getCoordinates();
      var srcString = "http://3.144.121.210:3001/?lat=";
      srcString = srcString.concat(lat);
      srcString = srcString.concat("&lng=");
      srcString = srcString.concat(lng);

      const response = await fetch(
        `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&username=famfrank1298`
      );
      const data = await response.json(); // holds the information regarding city, state, country

      // get the continent the country is from
      const response2 = await fetch(
        `https://restcountries.com/v3/name/${data.geonames[0].countryName}?fullText=true`
      );

      const data2 = await response2.json();

      const { hint, history } = await getHint(data2[0].continents[0]);
      setGenHint(hint);
      setHistoryHint(history);

      setCorrectLocation(
        data.geonames[0].countryName +
          ": (" +
          data.geonames[0].toponymName +
          ", " +
          data.geonames[0].adminName1 +
          ") "
      );
      console.log("Line 250: " + correctLocation);

      return srcString;
    }   // end of getIframeSrc

    getIframeSrc().then((src) => setIframeSrc(src));
  }, []);   // end of use effect

  const googleMapDisplayHandler = () => {
    setIsClicked(true);
  };

  const gStyle = {
    opacity: isClicked ? "1" : "0",
  };

  const getLatLon = (): { lat: number; lon: number } => {
    const latlon = iframeSrc.split("?")[1].split("&lng=");

    const lat = latlon[0].split("lat=")[1];
    const lon = latlon[1];

    return { lat: Number(lat), lon: Number(lon) };
  };

  async function getSelectedCountry(lat: number, lon: number) {
    const response9 = await fetch(
      `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&username=famfrank1298`
    );

    const data5 = await response9.json();
    setSelectedLocation(
      data5.geonames[0].countryName +
        ": (" +
        data5.geonames[0].toponymName +
        ", " +
        data5.geonames[0].adminName1 +
        ") "
    );
  }

  const getScore = (): number => {
    const { lat, lon } = getLatLon();
    const maxDistance = 20015; // approx max distance of two antipodal coords 
    getSelectedCountry(chosenLatLon.lat, chosenLatLon.lon);

    // convert coordinates from degrees to radians
    const lat1 = lat*Math.PI / 180;
    const lat2 = chosenLatLon.lat*Math.PI / 180;
    const lon1 = lon*Math.PI / 180;
    const lon2 = chosenLatLon.lon*Math.PI / 180;
    const distance = Math.acos(
        Math.sin(lat1)*Math.sin(lat2) + 
        Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1)
    )*6371;
    
    return 5000*(1 - distance/maxDistance);
  };

  const gameCompleted = isGameDone ? (
    <div className="game-done-shadow">
      <div className="game-done">
        <h3 style={{ textAlign: "center", width: "100%" }}>
          Congrats! Here's Your Score
        </h3>
        <p className="results_txt">
          SCORE: <b>{Math.round(getScore()).toFixed(1)}</b>
        </p>
        <p> .................</p>
        <p className="results_txt">
          CORRECT LOCATION: {"( "}
          {iframeSrc
            .split("?")[1]
            .split("&lng=")[0]
            .split("lat=")[1]
            .slice(0, 6)}
          {", "}
          {iframeSrc.split("?")[1].split("&lng=")[1].slice(0, 6)} {" )"}
        </p>
        <p className="results_txt">CORRECT COUNTRY: {correctLocation}</p>
        <p> .................</p>
        <p className="results_txt">
          YOUR CHOICE: {"( "} {Math.round(chosenLatLon.lat).toFixed(2)} {", "}
          {Math.round(chosenLatLon.lon).toFixed(2)} {" )"}
        </p>
        <p className="results_txt">YOUR COUNTRY: {selectedLocation}</p>
      </div>
      <div style={{ flexDirection:"row" }}>
        <BackButton /> 
        <PlayAgainButton />
      </div>

    </div>
  ) : (
    <></>
  );

  function closeHint() {
    setHintRequested(false);
    setHintRequested2(false);
    setHintRequested3("");
  }

  const getDisplayedHint = () => {
    let typeOfHint = "";
    if (hintRequested) {
      typeOfHint = "General Continent";
    } else if (hintRequested2) {
      typeOfHint = "History";
    } else if (hintRequested3 !== "") {
      typeOfHint = "ChatGPT";
    }

    return hintRequested || hintRequested2 || hintRequested3 !== "" ? (
      <div className="hint_container">
        <div className="hint_div">
          <button className="hint_btn" onClick={closeHint}>
            <b>X</b>
          </button>
          <p className="hint_title">
            <b>Sure here is your {typeOfHint} Hint:</b>
          </p>
          <p className="hint_display">
            <b>
              {hintRequested
                ? genHint[factCount]
                : hintRequested2
                ? historyHint[histCount]
                : hintRequested3}
            </b>
          </p>
        </div>
      </div>
    ) : (
      <></>
    );
  };

  const displayHint = getDisplayedHint();

  function getHintFact() {
    // console.log("Fact  " + genHint[factCount]);
    setHintRequested(true);
    setHintRequested2(false);

    if (factCount == genHint.length - 1) {
      setFactCount(0);
    } else {
      setFactCount(factCount + 1);
    }
  }

  function getHintHist() {
    // console.log("Hist  " + historyHint[histCount]);
    setHintRequested2(true);
    setHintRequested(false);

    if (histCount == historyHint.length - 1) {
      setHistCount(0);
    } else {
      setHistCount(histCount + 1);
    }
  }

  const [loading, setLoading] = useState(false);
  const enableChatGPT = () => {
    setHintRequested(false);
    setHintRequested2(false);
    setLoading(true);

    const askChatGPT = async () => {
      const { lat, lon } = getLatLon();

      const task = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Please give a random fact of the location at the coordinates ${lat} longitude and ${lon} latitude. In your answer, exclude latitude and longitude and name of location. Exclude any city names.`,
          },
        ],
      });

      const content = task.data.choices[0].message?.content!;
      console.log(content);
      setHintRequested3(content);
      setLoading(false);
    };

    askChatGPT();
  };

  const displayHowToPlay = () => {
    return howToPlay ? (
      <div>
        <div className="howToPlay_container">
          <button className="hint_btn" onClick={getHowToPlayPage}>
            <b>X</b>
          </button>
        </div>
      </div>
    ) : (
      <></>
    );
  };

  const displayHTP = displayHowToPlay();

  function getHowToPlayPage() {
    setHowToPlay(!howToPlay);
  }

  return (
    <div className="game">
      <User isMain={false} />
      <canvas className="game-screen"></canvas>
      <div className="game-screen">
        <iframe src={iframeSrc} className="streetview"></iframe>
      </div>
      <div className="game-header">
        <h1 className="game-title">
          <b>Maps.With.Friends</b>
        </h1>
        <p className="game-time">
          <b>
            <Timer setTimerDone={setTimerDone} setTimerKey={setTimerKey} />
          </b>
        </p>
      </div>
      <div className="game-buttons">
        <button className="game-btn" onClick={getHowToPlayPage}>
          <b>How To Play</b>
        </button>
        <button className="game-btn" onClick={getHintFact}>
          <b>Fact</b>
        </button>
        <button className="game-btn" onClick={getHintHist}>
          <b>History</b>
        </button>
        <button className="game-btn" onClick={enableChatGPT}>
          <b>ChatGPT</b>
        </button>
      </div>
      <GMap changeLatLon={changeLatLon}></GMap>

      {gameCompleted}
      {isGameLost}
      {/* {displayfactHint} */}
      {/* {displayhistHint} */}
      {loading ? <Loader /> : <></>}
      {displayHint}
      {displayHTP}
      {/* <BackButton /> */}
    </div>
  );
};

export default Game;
