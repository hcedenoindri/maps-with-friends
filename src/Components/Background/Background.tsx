import React, { FC } from "react";
import "./Background.css";

const Background: FC = (): JSX.Element => {
  return (
    <video id="background-video" autoPlay muted loop>
      <source
        src={require("../../assets/audio/backgroundEarth.mp4")}
        type="video/mp4"
      />
    </video>
  );
};

export default Background;
