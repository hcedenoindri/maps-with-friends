import React from "react";

interface AuthInterface {
  username: string;
  password: string;
  email: string;
  setUsername?: (username: string) => void;
  setPassword?: (password: string) => void;
  setEmail?: (email: string) => void;
  setLoading?: () => void;
  loading: boolean;
  signingUp?: () => void;
  loggingIn?: () => void;
  signup: boolean;
  login: boolean;
}

const AuthContext = React.createContext<AuthInterface>({
  username: "",
  password: "",
  signup: false,
  login: false,
  email: "",
  loading: false,
});

export default AuthContext;
