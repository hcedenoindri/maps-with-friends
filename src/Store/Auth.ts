import { supabase } from "./Supabase";
import { insertProfile, getProfile } from "../User/Profile";
import { dummyUser } from "../User/User";
import { useDispatch } from "react-redux";
import { createProfile } from "../Store/UserAuth";
import { store } from "./Store";
// const [signup, signingUp] = useState(false);
// const [login, loggingIn] = useState(false);

// const [username, setUsername] = useState("");
// const [password, setPassword] = useState("");

// const [email, setEmail] = useState("");

// const [loading, setLoading] = useState(false);

export const signupWithEmail = async (
  userInput: {
    email: string;
    password: string;
    username: string;
    changeOutcomeState: any;
  },
  rerenderForm: any
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userInput.email,
      password: userInput.password,
      options: {
        data: {
          username: userInput.username,
        },
      },
    });

    if (error) throw error;

    insertProfile(
      dummyUser.avatarImg,
      dummyUser.username,
      dummyUser.points,
      []
    );
    store.dispatch(createProfile(dummyUser)); // we are currently pulling from dummy data

    userInput.changeOutcomeState(() => {
      return { content: "check email to confirm!", type: true };
    });

    rerenderForm({ type: -1, formRender: false });
  } catch (error) {
    userInput.changeOutcomeState(() => {
      return { content: "Email already in use", type: false };
    });
  } finally {
    console.log("success");
  }
};

export const loginWithPassword = async (
  userInput: {
    email: string;
    password: string;
    changeOutcomeState: any;
  },
  rerenderForm: any
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userInput.email,
      password: userInput.password,
    });

    if (error) throw error;

    userInput.changeOutcomeState(() => {
      return { content: "successfully logged in", type: true };
    });

    // get current profile
    // get user ID
    getProfile();
    // store.dispatch();
    // get current profile, dispatch state

    // store.dispatch(createProfile(dummyUser)); // we are currently pulling from dummy data
    rerenderForm({ type: -1, formRender: false });
  } catch (error) {
    if (String(error) === "AuthApiError: Invalid login credentials") {
      userInput.changeOutcomeState(() => {
        return { content: "Invalid login credentials", type: false };
      });

      console.log("LOL");
    }
    if (String(error) === "AuthRetryableFetchError: Failed to fetch") {
      userInput.changeOutcomeState(() => {
        return {
          content: "Cannot connect to database; internet is probably down.",
          type: false,
        };
      });
    }
    if (String(error) === "AuthRetryableFetchError: {}") {
      userInput.changeOutcomeState(() => {
        return { content: "Random Error, please contact us", type: false };
      });
    }
  } finally {
  }
};

export const signMeOut = async (changeOutcomeState: any) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
    changeOutcomeState(() => {
      return { content: "successfully signed out", type: true };
    });
  } catch (error) {
    console.log("error in signing out");
  } finally {
    console.log("TEST SIGN OUT");
  }
};

// const signUpWithFaceBook async (userInput: authParam) => {
// }
