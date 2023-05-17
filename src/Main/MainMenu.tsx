import React, { FC, useState } from "react";
import "./MainMenu.css";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import Form from "../Forms/Form";
import { signMeOut } from "../Store/Auth";
import { useSelector, useDispatch } from "react-redux";
import { authUserLogout } from "../Store/UserAuth";
import PopupToast from "../Components/PopupToast";
import User from "../Components/UserUI/User";
import Background from "../Components/Background/Background";

const useStyles = makeStyles({
  button: {
    boxShadow: `0 0 1px 1px #FFF`,
    color: "#333",

    "&:hover": {
      boxShadow: `0 0 5px 5px #FFF`,
    },
  },
});

const MainMenu: FC = () => {
  const navigate = useNavigate();

  const [outcomeState, changeOutcomeState] = useState({
    content: "",
    type: false,
  });

  const [formState, changeFormState] = useState({
    type: -1,
    formRender: false,
  });

  const { user, isAuth } = useSelector((state: any) => state.userReducer);

  const onPlay = (e: any): void => {
    navigate("/play");
  };
  const onPlayScreen = (e: any): void => {
    navigate("/playscreen");
  };

  const switchForm = (prevStateNum: number, newStateNum: number) => {
    changeFormState((prevState) => {
      let reRender: boolean = !prevState.formRender;
      if (prevState.type === prevStateNum && prevState.formRender)
        reRender = prevState.formRender;

      return { type: newStateNum, formRender: reRender };
    });
  };

  const auth = (
    <>
      <button
        onClick={() => {
          switchForm(1, 0);
        }}
        className="button-mine"
      >
        Signup
      </button>

      <button
        onClick={() => {
          switchForm(0, 1);
        }}
        className="button-mine"
      >
        Login
      </button>
    </>
  );
  const [howToPlay, setHowToPlay] = useState(false);

  const displayHowToPlay = () => {
    return howToPlay ? (
      <div>
        <div className="howToPlay_container">
          <button
            className="hint_btn"
            onClick={getHowToPlayPage}
            style={{ cursor: "pointer" }}
          >
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
    <>
      <Background />
      <section className="main-menu">
        <User isMain={true} />
        <PopupToast
          timeDuration={3000}
          change={outcomeState}
          vertical={"down"}
          onChange={changeOutcomeState}
        />
        <div className="big-container">
          <h1 className="main-menu-title">Maps With Friends</h1>
          <h1 className="main-menu-desc">
            Put Your Geography Skills to the Test!
          </h1>
          <div className="flex-col">
            <Form
              type={formState.type}
              rerender={changeFormState}
              render={formState.formRender}
            />
            <button onClick={onPlayScreen} className="button-mine">
              Play
            </button>
            {isAuth ? <></> : auth}
            <button
              onClick={() => {
                navigate("/about");
              }}
              className="button-mine"
            >
              About
            </button>
            <button className="button-mine" onClick={getHowToPlayPage}>
              How
            </button>
            <a
              className="donate"
              href="https://www.buymeacoffee.com/davidserranodev"
              target="_blank"
            >
              donate!
            </a>
          </div>
        </div>
        {displayHTP}
      </section>
    </>
  );
};

export default MainMenu;
