import React, { FC, useState } from "react";
import "./Form.css";
import { signupWithEmail } from "../Store/Auth";
import { loginWithPassword } from "../Store/Auth";
import PopupToast from "../Components/PopupToast";
import { supabase } from "../Store/Supabase";
import {
  insertProfile,
  insertProfileID,
  signInWithFacebook,
} from "../User/Profile";
import { dummyUser } from "../User/User";

const types: { SIGNUP: number; LOGIN: number } = {
  SIGNUP: 0,
  LOGIN: 1,
};
Object.freeze(types);

interface Form {
  type: number;
  render: boolean;
  rerender: any;
}

const Form: FC<Form> = ({ type, render, rerender }): JSX.Element => {
  const [outcomeState, changeOutcomeState] = useState({
    content: "",
    type: false,
  });

  let color: string = "";
  let title: string = "";
  if (type === types.SIGNUP) {
    color = "primary";
    title = "Sign up!";
  } else if (type === types.LOGIN) {
    color = "secondary";
    title = "Login!";
  }

  const submitForm = (e: any): void => {
    e.preventDefault();
    let target: HTMLElement = e.target!;

    let allInput: string = "";
    target
      .querySelectorAll("input")
      .forEach((input: HTMLInputElement, i: number) => {
        allInput += input.value + "/**/";
      });

    const inputs = allInput.split("/**/");
    if (type === 0) {
      signupWithEmail(
        {
          email: inputs[0],
          password: inputs[2],
          username: inputs[1], // username is the second one
          changeOutcomeState: changeOutcomeState,
        },
        rerender
      );
    }

    if (type === 1) {
      loginWithPassword(
        {
          email: inputs[0],
          password: inputs[1],
          changeOutcomeState: changeOutcomeState,
        },
        rerender
      );
    }
  };

  const usernameInput =
    type === types.SIGNUP ? (
      <input placeholder="username" type="username" />
    ) : (
      <></>
    );

  return (
    <form
      onSubmit={submitForm}
      className={`form ${color} ${render ? "render" : ""}`}
    >
      <PopupToast
        timeDuration={3000}
        change={outcomeState}
        onChange={changeOutcomeState}
        vertical={"up"}
      />
      <h3>{title}</h3>
      <input placeholder="email" type="email" />
      {usernameInput}
      <input placeholder="password" type="password" />
      <button>{title.slice(0, title.length - 1)}</button>
      <button
        onClick={(e) => {
          e.preventDefault();

          signInWithFacebook();
        }}
      >
        Facebook
      </button>
    </form>
  );
};

export default Form;
