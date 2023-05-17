import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonI {}

const BackButton: FC<BackButtonI> = () => {
  const navigate = useNavigate();

  return (
    <button
      style={{
        position: "absolute",
        left: "2%",
        bottom: "1%",
        // height: "5%",
        // textAlign: "center",
      }}
      onClick={() => {
        navigate("/");
      }}
      className="choose-game"
    >
      BACK
    </button>
  );
};

export default BackButton;
