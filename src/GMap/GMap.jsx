import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GMap.css";
import GoogleMapReact from "google-map-react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function GMap({ changeLatLon }) {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 2,
  };
  const [marker, setMarker] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLatLng, setCurrentLatLng] = useState("");
  const open = Boolean(anchorEl);

  const Marker = (props) => {
    useEffect(() => {
      setCurrentLatLng("Latitude: " + props.lat + "\nLongtiude: " + props.lng);
      setAnchorEl(document.querySelector(".marker"));
    });

    return (
      <div
        aria-describedby="simple-popover"
        lat={props.lat}
        lng={props.lng}
        className="marker"
        onClick={handleClickOnMarker}
      >
        📌
      </div>
    );
  };

  const handleClickOnMarker = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const clickedMap = (e) => {
    const { lat, lng } = e;

    setMarker(<Marker lat={lat} lng={lng} />);

    changeLatLon((prevState) => {
      prevState.lat = lat;
      prevState.lon = lng;
      return { ...prevState };
    });
  };

  const [fullscreen, setFullscreen] = useState(false);
  const [btn_txt, setBtn_txt] = useState("+");

  function changeSize() {
    setFullscreen(!fullscreen);

    if (fullscreen) {
      setBtn_txt("+");
    } else {
      setBtn_txt("-");
    }
  }

  return (
    // Important! Always set the container height explicitly
    <div className={fullscreen ? "gmapBig" : "gmap"}>
      <button className="fullscreen_btn" onClick={changeSize}>
        <b>{btn_txt}</b>
      </button>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAaLVvD99DfxJn_vnFkBWoRGyFFU6Ww4E8" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onClick={clickedMap}
        yesIWantToUseGoogleMapApiInternals
      >
        {marker}
        {/* <Popover
          id="simple-popover"
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Typography sx={{ p: 2 }}>{currentLatLng}</Typography>
        </Popover> */}

        <div className="guess" />
      </GoogleMapReact>
    </div>
  );
}
