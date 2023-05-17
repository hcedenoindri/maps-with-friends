import User from "../Components/UserUI/User";
import Background from "../Components/Background/Background";
import "./Playscreen.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { supabase } from "../Store/Supabase";
import { authUserLogin } from "../Store/UserAuth";
import PopupToast from "../Components/PopupToast";
import BackButton from "../Components/Back/BackButton";

const Playscreen = (): JSX.Element => {
  const navigation = useNavigate();
  const [chosenMode, setChosenMode] = useState("");
  const dispatch = useDispatch();

  const [popupToast, onPopupToastChange] = useState({
    content: "",
    type: false,
  });

  const user = useSelector((state: any) => state.userReducer);
  useEffect(() => {
    // @ts-ignore
    const sessioni = async () => {
      if (user === undefined) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          dispatch(authUserLogin(data?.session?.user));
        } catch (error) {
        } finally {
        }
      }
      // @ts-ignore

      // dispatch(authUserLogin(session.user));

      supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user;
        dispatch(authUserLogin(currentUser));
      });
    };

    sessioni();
  }, [user]);

  const modes: JSX.Element = (
    <>
      <button
        className="mode single-player"
        onClick={() => {
          setChosenMode("SINGLE");
        }}
      >
        Single&nbsp;Player
      </button>
      <button
        className="mode multi-player"
        onClick={() => {
          console.log(user.isAuth);
          if (user.isAuth) {
            setChosenMode("MULTI");
          } else {
            onPopupToastChange({
              content: "Please log in first",
              type: false,
            });
            console.log("User not logged in"); //put funny screen here or something
          }
        }}
      >
        Multiplayer
      </button>
    </>
  );
  const gameSingle: JSX.Element = (
    <>
      <button
        className="choose-game"
        onClick={() => {
          navigation("../Play");
        }}
      >
        Single player game
      </button>
      {/* <button className="choose-game" onClick={() => {}}>
          Single player game 2
        </button> */}
    </>
  );
  const gameMulti: JSX.Element = (
    <>
      <button
        className="choose-game"
        onClick={() => {
          if (user.isAuth) {
            //pass the user into here
            const encodedObject = encodeURIComponent(JSON.stringify(user));
            navigation(`../Multi?user=${encodedObject}`);
          } else {
            onPopupToastChange({
              content: "Please log in first for multiplayer",
              type: false,
            });
          }
        }}
      >
        Multiplayer game
      </button>
    </>
  );

  return (
    <>
      <Background />
      <section className="playscreen">
        <User isMain={false} />
        <h1 className="playscreen-title">
          <b>Select Game Mode</b>
        </h1>

        <div className="flex-position-center">
          {chosenMode === "" ? (
            <>{modes}</>
          ) : (
            <button
              onClick={() => {
                setChosenMode("");
              }}
              className="choose-game"
            >
              Back
            </button>
          )}
          {chosenMode === "SINGLE" ? (
            gameSingle
          ) : chosenMode === "MULTI" ? (
            gameMulti
          ) : (
            <></>
          )}
          <PopupToast
            timeDuration={3000}
            change={popupToast}
            onChange={onPopupToastChange}
            vertical={"up"}
          />
        </div>
        <BackButton />
      </section>
    </>
  );
};

export default Playscreen;
