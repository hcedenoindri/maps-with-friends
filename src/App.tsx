import React, { FC, useEffect, useState } from "react";
import MainMenu from "./Main/MainMenu";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Game/Game";
import Multi from "./Game/Multi";
import Wait from "./Game/WaitforConnect";
import Wait2 from "./Game/Waiting";
import Link from "./Game/SignInMulti";
import About from "./About/About";
import Profile from "./Profile/Profile";
import How from "./How/How";
import GMap from "./GMap/GMap";
import { useSelector, useDispatch } from "react-redux";

import { supabase } from "./Store/Supabase";
import { authUserLogin } from "./Store/UserAuth";
import { createProfile } from "./Store/UserAuth";

import { dummyUser } from "./User/User";
import Playscreen from "./Game/Playscreen";
import { getProfile, insertProfile } from "./User/Profile";
import { store } from "./Store/Store";
import { addAbortSignal } from "stream";

// const tempUserData = {

// }

const App: FC = () => {
  const user = useSelector((state: any) => state.userReducer);

  const dispatch = useDispatch();

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

      if (user.isAuth && user.profile.avatarImg === undefined) {
        insertProfile(
          dummyUser.avatarImg,
          dummyUser.username,
          dummyUser.points,
          []
        ).then((response) => {
          console.log("AFTER");
          if (response !== null && Number(response.code) === 23505) {
            // if theres an error in inserting profile, we already created
            // profile
            getProfile();
          } else {
            store.dispatch(createProfile(dummyUser)); // we are currently pulling from dummy data
          }
        });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user;
        dispatch(authUserLogin(currentUser));
      });
    };

    sessioni();
  }, [user]);

  console.log(user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play" element={<Game />} />
        <Route path="/multi" element={<Multi />} />
        <Route path="/wait2" element={<Wait2 />} />
        <Route path="/wait" element={<Wait />} />
        <Route path="/how" element={<How />} />
        <Route path="/link" element={<Link />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/playscreen" element={<Playscreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
