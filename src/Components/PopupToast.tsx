import React, { FC, useEffect } from "react";
import "./PopupToast.css";

interface popupToastI {
  timeDuration: number;
  onChange: any;
  change: { content: string; type: boolean };
  vertical: string;
}
const PopupToast: FC<popupToastI> = ({
  timeDuration,
  change,
  onChange,
  vertical,
}): JSX.Element => {
  useEffect(() => {
    const timeout = setTimeout(function () {
      onChange(() => ({ content: "", type: "" }));
    }, timeDuration);

    return () => clearTimeout(timeout);
  }, [change]);

  const toast: JSX.Element = (
    <figure
      className={`toast ${vertical} ${change.type ? "success" : "error"}`}
    >
      <p className="toast-content">{change.content}</p>
    </figure>
  );

  return <>{change.content !== "" ? toast : <></>}</>;
};

export default PopupToast;
