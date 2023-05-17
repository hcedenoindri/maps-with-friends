import { supabase } from "../Store/Supabase";
import { dummyUser, UserI } from "./User";
import { createProfile } from "../Store/UserAuth";
import { store } from "../Store/Store";

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
  });

  return data;
}

export const insertProfileID = async (
  avatar_img: string,
  username: string,
  points: number,
  friends: string[]
) => {
  try {
    const { data, error } = await supabase.rpc("insert_profile_data", {
      avatar_img_input: JSON.stringify(avatar_img),
      username_input: username,
      points_input: points,
      friends_input: JSON.stringify({ friends: friends }),
    });
    if (error) throw error;
    console.log("successful insertion");
  } catch (error: any) {
    if (error.code === "23505") {
      console.log("Already inserted Profile.");
    }
    console.log(error);
  }

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

export const insertProfile = async (
  avatar_img: string,
  username: string,
  points: number,
  friends: string[]
) => {
  const { data, error: inserted } = await supabase.rpc("insert_profile_data", {
    avatar_img_input: JSON.stringify(avatar_img),
    username_input: username,
    points_input: points,
    friends_input: JSON.stringify({ friends: friends }),
  });

  if (data) {
    console.log("successful insertion");
  }

  if (inserted !== null && inserted!.code === "23505") {
    console.log("Already inserted Profile.");
  }

  try {
    const { data, error } = await supabase.rpc("insert_friend_requests", {
      requests_input: JSON.stringify({ requests: [""] }),
    });
    if (error) throw error;

    console.log(data);
  } catch (error: any) {
    console.log(error);
  }

  return inserted;
};

export const getProfile = async () => {
  const profile: UserI = {
    avatarImg: "",
    username: "",
    points: 0,
    friends: [],
  };
  try {
    const { data, error } = await supabase.rpc("get_profile_avatar_img");
    console.log(data);
    if (error) throw error;
    console.log(profile.avatarImg);
    profile.avatarImg = data as unknown as string;
  } catch (error: any) {
    console.log("ERORR");
  } finally {
    try {
      const { data, error } = await supabase.rpc("get_profile_username");
      profile.username = data as unknown as string;
    } catch (error: any) {
      console.log("ERORR");
    } finally {
      try {
        const { data, error } = await supabase.rpc("get_profile_points");

        profile.points = data as unknown as number;
      } catch (error: any) {
        console.log("ERORR");
      } finally {
        try {
          const { data, error } = await supabase.rpc("get_profile_friends");
          if (error) throw error;

          profile.friends = JSON.parse(data as unknown as string).friends;
        } catch (error: any) {
          console.log("ERORR");
        } finally {
          // THIS IS WHEN WE WANT TO UPDATE GLOBAL PROFILE STATE
          store.dispatch(createProfile(profile));
        }
      }
    }
  }
};

export const updateProfileAvatarImg = async (avatarImg: string) => {
  try {
    const { data, error } = await supabase.rpc("update_profile_avatar_img", {
      avatar_img_input: avatarImg,
    });

    if (error) throw error;
  } catch (error: any) {
    console.log("Error in updating profile avatar img");
  }
};

export const updateProfileUsername = async (username: string) => {
  try {
    const { data, error } = await supabase.rpc("update_profile_username", {
      username_input: username,
    });

    if (error) throw error;
  } catch (error: any) {
    console.log("Error in updating profile avatar img");
  }
};

export const updateProfilePoints = async (points: number) => {
  try {
    const { data, error } = await supabase.rpc("update_profile_points", {
      points_input: points,
    });

    if (error) throw error;
  } catch (error: any) {
    console.log("Error in updating profile avatar img");
  }
};

// export const updateProfileUsername = async (username: string) => {
//   try {
//     const { data, error } = await supabase.rpc("update_profile_username", {
//       username_input: username,
//     });

//     if (error) throw error;
//   } catch (error: any) {
//     console.log("Error in updating profile avatar img");
//   }
// };
