import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface PlayAgainButtonI {}

const PlayAgainButton: FC<PlayAgainButtonI> = () => {
  const navigate = useNavigate();

  return (
    <button
      style={{
        position: "absolute",
        left: "10%",
        bottom: "1%",
        // height: "5%",
        // textAlign: "center",
      }}
      onClick={() => {
        window.location.reload();
      }}
      className="choose-game"
    >
      PLAY AGAIN
    </button>
  );
};

export default PlayAgainButton;