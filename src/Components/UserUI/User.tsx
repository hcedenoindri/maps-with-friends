import React, { FC, useState } from "react";
import "./User.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authUserLogout } from "../../Store/UserAuth";
import { signMeOut } from "../../Store/Auth";
import PopupToast from "../PopupToast";

import Male1 from "../../assets/svg/svg/Male1";
import Female1 from "../../assets/svg/svg/Female1";
import Male2 from "../../assets/svg/svg/Male2";
import Female2 from "../../assets/svg/svg/Female2";

interface UserCI {
  isMain: boolean;
}

const defaultUser = {};

const User: FC<UserCI> = ({ isMain }): JSX.Element => {
  const profile = useSelector((state: any) => state.userReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [outcomeState, changeOutcomeState] = useState({
    content: "",
    type: false,
  });

  const [userOptions, showUserOptions] = useState(false);

  const showOptions = (e: any): void => {
    showUserOptions((prevState) => !prevState);
  };

  const returnImage = (): JSX.Element => {
    const avatarImg: string = profile.profile.avatarImg;
    if (avatarImg === "Male1") {
      return Male1;
    } else if (avatarImg === "Female1") {
      return Female1;
    } else if (avatarImg === "Male2") {
      return Male2;
    } else if (avatarImg === "Female2") {
      return Female2;
    }
    return Male1;
  };

  const options = (
    <div className={`user-options ${userOptions ? "show" : ""}`}>
      {profile.user?.id ? (
        <button
          className="button-mine"
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
        </button>
      ) : (
        <></>
      )}
      <button
        className="button-mine"
        onClick={() => {
          navigate("/");
        }}
      >
        Main Menu
      </button>
      {profile.user?.id ? (
        <button
          className="button-mine"
          onClick={() => {
            navigate("/");
            window.location.reload();
            dispatch(authUserLogout());
            signMeOut(changeOutcomeState);
          }}
        >
          Sign out
        </button>
      ) : (
        <></>
      )}
    </div>
  );
  return (
    <aside className={`user-aside ${isMain ? "" : "profile-page"}`}>
      <div className="user-avatar-div" onClick={showOptions}>
        {returnImage()}
        {options}
      </div>
      <h3 className="user-title">{profile.profile.username}</h3>
      <p className="user-points">
        {profile.profile.points}&nbsp;
        {profile.profile.points !== undefined ? "pts" : ""}
      </p>
      <PopupToast
        timeDuration={3000}
        change={outcomeState}
        vertical={"down"}
        onChange={changeOutcomeState}
      />
    </aside>
  );
};

export default User;
