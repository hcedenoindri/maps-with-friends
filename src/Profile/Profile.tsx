import React, { FC, useRef, useState, RefObject, useEffect } from "react";
import "./Profile.css";
import Background from "../Components/Background/Background";
import User from "../Components/UserUI/User";

import Male1 from "../assets/svg/svg/Male1";
import Female1 from "../assets/svg/svg/Female1";
import Male2 from "../assets/svg/svg/Male2";
import Female2 from "../assets/svg/svg/Female2";
import { useDispatch, useSelector } from "react-redux";
import { updateUsername, updateAvatarImg } from "../Store/UserAuth";
import { updateProfileAvatarImg, updateProfileUsername } from "../User/Profile";
import { supabase } from "../Store/Supabase";

import { sendRequest, getRequests, acceptRejectRequest } from "../User/Friends";
import Checkmark from "../assets/svg/svg/Checkmark";
import Close from "../assets/svg/svg/Close";
import { dummyUser } from "../User/User";
import { insertProfile } from "../User/Profile";
const imgs = ["Male1", "Male2", "Female1", "Female2"];

const Profile: FC = (): JSX.Element => {
  const [requestList, updateRequestList] = useState([]);
  const profile = useSelector((state: any) => state.userReducer);

  // useEffect(() => {
  //   const data = supabase
  //     .channel("custom-all-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "profile" },
  //       (message) => {
  //         console.log("Message updated!", message);
  //       }
  //     )
  //     .subscribe();
  // }, []);

  const friendInputRef = useRef() as RefObject<HTMLInputElement>;
  const selectRef = useRef() as RefObject<HTMLSelectElement>;
  useEffect(() => {
    const getRequests = async (id: string) => {
      try {
        const { data, error } = await supabase.rpc(
          "get_users_friend_requests",
          {
            user_id: id,
          }
        );
        if (error) throw error;

        updateRequestList(JSON.parse(data as unknown as string).requests);
      } catch (error: any) {
        console.log("ERRORR");
        console.log(error);
      }
    };

    // if (profile.user === undefined) return;

    getRequests(profile.user.id);
  }, []);

  const getCurrent = (avatarImg: string) => {
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

  const [curImage, changeCurImage] = useState(
    getCurrent(profile.profile.avatarImg)
  );
  const dispatch = useDispatch();

  const onChangeAvatarImg = (e: any) => {
    changeCurImage(() => {
      const avatarImg: string = e.target.value;

      return getCurrent(avatarImg);
    });
    // update user state
  };

  const onSubmitAvatarImg = (e: any) => {
    e.preventDefault();
    const value = e.target.querySelector("select").value;
    dispatch(updateAvatarImg(value));
    updateProfileAvatarImg(value);

    // update user state
  };

  const onSubmitNewUsername = (e: any) => {
    e.preventDefault();
    const value = e.target.querySelector("input").value;
    dispatch(updateUsername(value));
    updateProfileUsername(value);
  };

  const onSubmitAddFriend = (e: any) => {
    e.preventDefault();
    const submittedFriendId = friendInputRef?.current?.value!;

    sendRequest(submittedFriendId, profile.user.id);
  };

  return (
    <>
      <Background />
      <User isMain={false} />
      <div className="profile-items">
        <figure className="profile-item avatar-img">
          <form onSubmit={onSubmitAvatarImg}>
            <h3>Profile&nbsp;Picture</h3>
            <p>lol we only have 4 pictures to choose from.</p>
            <div className="center">
              <div className="avatar-img-div">{curImage}</div>
            </div>
            <select onChange={onChangeAvatarImg}>
              {imgs.map((img: string, key: number) => {
                return (
                  <option
                    selected={profile.profile.avatarImg === img ? true : false}
                    value={img}
                  >
                    {img}
                  </option>
                );
              })}
            </select>
            <button type="submit" className="button-mine profile">
              Change
            </button>
          </form>
        </figure>
        <figure className="profile-item username">
          <form onSubmit={onSubmitNewUsername}>
            <h3>New&nbsp;Username</h3>
            <p>No bad words. We are not paid enough to implement this tho.</p>
            <input placeholder="Enter new username" />
            <button type="submit" className="button-mine profile">
              Change
            </button>
          </form>
        </figure>
        <figure className="profile-item friends">
          <form onSubmit={onSubmitAddFriend}>
            <h3>Add&nbsp;Friend</h3>
            <p>Enter their user ID in here</p>
            <p>Your user ID: </p>
            <p>{profile.user.id ? profile.user.id : "Log in"}</p>
            <input ref={friendInputRef} placeholder="Enter friend's ID" />
            <button type="submit" className="button-mine profile">
              Send
            </button>
          </form>
        </figure>
        <figure className="profile-item friends">
          <form onSubmit={onSubmitAddFriend}>
            <h3>Requests</h3>
            <select ref={selectRef}>
              {requestList === null ? (
                <></>
              ) : (
                requestList.map((request: string, i: number) => {
                  return <option value={request}>{request}</option>;
                })
              )}
            </select>
            <div className="button-box">
              <button
                onClick={() => {
                  // insertProfile(
                  //   dummyUser.avatarImg,
                  //   dummyUser.username,
                  //   dummyUser.points,
                  //   []
                  // );
                  acceptRejectRequest(
                    true,
                    requestList,
                    selectRef?.current?.value!
                  );
                }}
                className="button-mine friends"
              >
                <Checkmark />
              </button>
              <button
                onClick={() => {
                  acceptRejectRequest(
                    false,
                    requestList,
                    selectRef?.current?.value!
                  );
                }}
                className="button-mine friends"
              >
                <Close />
              </button>
            </div>
          </form>
        </figure>
        <figure className="friend-list">
          <h3>Friends:</h3>
          {profile.profile.friends.map((friend: string, i: number) => {
            return <div className="friend">{friend}</div>;
          })}
        </figure>
      </div>
    </>
  );
};
export default Profile;
