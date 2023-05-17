import { Triangle } from "react-loader-spinner";

export function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: "999999",
        right: "50%",
        bottom: "0%",
      }}
    >
      <Triangle
        height="160"
        width="160"
        color=" #441a0a"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        //@ts-ignore
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
}
