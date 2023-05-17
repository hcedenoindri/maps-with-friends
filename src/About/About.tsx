import React, { FC } from "react";
import "./About.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import BackButton from "../Components/Back/BackButton";
import Background from "../Components/Background/Background";

const developers: string[] = [
  "David Serrano",
  "Hector Cedeno-Indriago",
  "Frank Mensah",
  "Carson Goodwin",
];

const About: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const style = {
    width: `25%`,
    padding: `1.2rem 2.4rem`,
    fontSize: `2rem`,
  };

  return (
    <section className="">
      <BackButton />
      <Background />
      <div className="container">
        <h1 className="about-title">About</h1>
        <p className="about-desc">
          You ever play Geoguessr but then get upset because it's pay to play?{" "}
          {String.fromCodePoint(0x1f621)}
          <br></br>
          <br></br>
          Then we have a game for you!
          {String.fromCodePoint(0x1f60b)}
          <br></br>
          <br></br>
          Created by yours truly
          <ol className="about-ol">
            {developers.map((developer: string, i: number) => (
              <li className="dev-name">- {developer}</li>
            ))}
          </ol>
        </p>
      </div>
    </section>
  );
};

export default About;
