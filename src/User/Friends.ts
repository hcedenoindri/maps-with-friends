import { supabase } from "../Store/Supabase";
import { UserI } from "./User";
// import { v5 } from "uuid";

const resetProfile = async () => {
  try {
    const { data, error } = await supabase.rpc("insert_friend_requests", {
      requests_input: JSON.stringify({ requests: [""] }),
    });
    if (error) throw error;

    console.log(data);
  } catch (error: any) {
    console.log(error);
  }
};

const updateRequests = async (requests: string[]) => {
  try {
    const { data, error } = await supabase.rpc("update_friend_requests", {
      requests_input: JSON.stringify({
        requests: requests,
      }),
    });

    if (error) throw error;

    console.log("SUCCESSFULLY UPDATED");
  } catch (error: any) {
    console.log(error);
  }
};

// get json object
// push on myId
// filter out any blank
// return
const addRequest = (jsonObject: any, myId: string): string[] => {
  let requests: string[] = jsonObject.requests;
  requests.push(myId);

  requests = requests.filter(
    (request: string, i: number) => request.length !== 0
  );

  return requests;
};

const removeRequest = (requests: string[], id: string): string[] => {
  requests = requests.filter((request: string, i: number) => request !== id);

  return requests;
};

// retrieve specified user's friend requests
// push on myId
export const sendRequest = async (id: string, myId: string) => {
  try {
    const { data, error } = await supabase.rpc("get_users_friend_requests", {
      user_id: id,
    });
    if (error) throw error;

    updateRequests(addRequest(JSON.parse(data as unknown as string), myId));
  } catch (error: any) {
    console.log(error);
  }
};

export const getRequests = async (id: string) => {
  try {
    const { data, error } = await supabase.rpc("get_users_friend_requests", {
      user_id: id,
    });
    if (error) throw error;

    return JSON.parse(data as unknown as string);
  } catch (error: any) {
    console.log(error);
  }
};

const addFriend = async (friendId: string) => {
  try {
    const { data, error } = await supabase.rpc("get_profile_friends");

    if (error) throw error;

    let friendsList: string[] = JSON.parse(data as unknown as string).friends;
    //
    // console.log(friendsList);
    // friendsList.find((friend: string) => friend === friendId)
    if (!friendsList.includes(friendId)) friendsList.push(friendId);

    try {
      const { data, error } = await supabase.rpc("update_profile_friends", {
        friends_input: JSON.stringify({ friends: friendsList }),
      });

      if (error) throw error;

      console.log("SUCCESSFUL");
    } catch (error: any) {
      console.log(error);
    }
  } catch (error: any) {
    console.log(error);
    console.log("SUCCESSFULLY ADDED");
  }
};

export const acceptRejectRequest = async (
  accept: boolean,
  requests: string[],
  id: string
) => {
  requests = removeRequest(requests, id);

  try {
    const { data, error } = await supabase.rpc("update_friend_requests", {
      requests_input: JSON.stringify({
        requests: requests,
      }),
    });

    if (error) throw error;

    if (accept) {
      addFriend(id);
    }
  } catch (error: any) {
    console.log(error);
  }
};
