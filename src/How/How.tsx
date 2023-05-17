import React, { FC } from "react";
import "./How.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const How: FC = (): JSX.Element => {
  const navigate = useNavigate();

  const style = {
    width: `25%`,
    padding: `1.2rem 2.4rem`,
    fontSize: `2rem`,
  };
  return (
    <section className="section-how">
      <Button
        sx={style}
        className="button"
        onClick={() => {
          navigate("/");
        }}
        variant="contained"
      >
        Back
      </Button>
      Section How
    </section>
  );
};

export default How;
