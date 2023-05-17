/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
//mprk0ZDKotsVJQE
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database


async function initialize() {
  var success = 0;
  var fenway = {lat: 0.0, lng:0.0};
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  var coordLat = urlParams.get('lat');
  var coordLng = urlParams.get('lng');
  if(coordLat != null && coordLng != null){
  fenway = { lat: parseFloat(coordLat), lng: parseFloat(coordLng)};
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano") as HTMLElement,
    {
      position: fenway,
      pov: {
        heading: 34,
        pitch: 10,
      },
      linksControl: false,
      panControl: false,
      disableDefaultUI: true,
      showRoadLabels: false,
    }
  );
  }
}

declare global {
  interface Window {
    initialize: () => void;
  }
}
window.initialize = initialize;

export {};