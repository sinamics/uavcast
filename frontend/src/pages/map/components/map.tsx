/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import map from 'lodash/map';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import { LineString, MultiLineString } from 'geojson';
import planeIcon from '../../../images/map_icons/plane-icon.png';
import quadIcon from '../../../images/map_icons/quad-icon.png';
import shadowMarker from '../../../images/map_icons/marker-shadow.png';

//@ts-ignore
// eslint-disable-next-line prefer-reflect
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: shadowMarker,
  shadowSize: [0, 0],
  shadowAnchor: [0, 0],
  iconSize: [80, 80],
  iconAnchor: [40, 40],
  popupAnchor: [-3, -76]
});

// Set default plane icon
let markerIcon = new L.Icon({
  iconUrl: planeIcon,
  iconRetinaUrl: planeIcon
});

let mymap: L.Layer | L.Map | any;
let marker: L.Marker<any>;

let zoom = 12;

let missions = 0;
let polygon: L.Polyline<LineString | MultiLineString, any> | undefined;
const copterEnum = [2, 3, 4, 13, 14, 15];

const LeafLet = ({ children, message, db_uavnav }: any) => {
  const [state, setState] = useState({ mapLoaded: false, mapHasPan: false });
  useEffect(() => {
    const hasGpsData = !!(message?.gps_raw_int && message.gps_raw_int?.satellites_visible > 3);

    // Disable windows right click
    // document.addEventListener('contextmenu', function (event) {
    //   event.preventDefault();
    // });
    if (copterEnum.includes(message?.heartbeat.type)) {
      // we have a copter type vehicle, set new icon
      markerIcon = new L.Icon({
        iconUrl: quadIcon,
        iconRetinaUrl: quadIcon
      });
    }

    if (!state.mapLoaded) {
      if (!hasGpsData) {
        zoom = 5;
      }

      mymap = L.map('mapid', {
        center: [2.8631169, 2.3708919],
        zoom: zoom,
        // zoomOffset: -3,
        zoomControl: false,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }),
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 17,
            attribution:
              // eslint-disable-next-line max-len
              'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          })
        ]
      });

      marker = L.marker([message?.gps_raw_int.lat / 10000000.0 || 0, message?.gps_raw_int.lon / 10000000.0 || 0], {
        rotationAngle: message?.vfr_hud.heading,
        rotationOrigin: message?.vfr_hud.heading
      }).addTo(mymap);

      L.tooltip({ permanent: true, opacity: 0.6 }, mymap);

      setState({ ...state, mapLoaded: true });
    }

    // Update icon
    if (marker) {
      marker.setIcon(markerIcon);
    }

    if (marker && hasGpsData) {
      const airspeed = Math.round(message?.vfr_hud.airspeed * 3.6 * 10) / 10;
      marker.bindTooltip(hasGpsData ? airspeed + ' Km/t' : 'No GPS data').openTooltip();
      marker.setRotationAngle(message?.vfr_hud.heading);
      marker.setRotationOrigin('center center');
      marker.setLatLng([message?.gps_raw_int.lat / 10000000.0 || 0, message?.gps_raw_int.lon / 10000000.0 || 0]);
    }

    // Handle pan and auto pan
    if (mymap && hasGpsData && !state.mapHasPan) {
      mymap.panTo(new L.LatLng(message?.gps_raw_int.lat / 10000000.0 || 0, message?.gps_raw_int.lon / 10000000.0 || 0));
      mymap.setZoom(15);

      setState({ ...state, mapHasPan: true });
    }
    if (mymap && db_uavnav && db_uavnav.map_auto_pan && state.mapHasPan) {
      mymap.flyTo(new L.LatLng(message?.gps_raw_int.lat / 10000000.0 || 0, message?.gps_raw_int.lon / 10000000.0 || 0));
      setState({ ...state, mapHasPan: true });
    }

    if (message?.mission_waypoints?.length === 0 && polygon) {
      mymap.removeLayer(polygon);
      polygon = undefined;
      missions = 0;
    }
    if (message?.mission_waypoints?.length > 0 && message?.mission_waypoints.length !== missions) {
      missions = message?.mission_waypoints.length;

      const latlng = map(message?.mission_waypoints, (w) => [w.x / 10000000.0, w.y / 10000000.0]);
      //@ts-ignore
      polygon = L.polyline(latlng, { color: 'yellow' }).addTo(mymap);
      mymap.fitBounds(polygon.getBounds());
    }
  }, [message]);

  return <div id='mapid'>{children}</div>;
};

export default LeafLet;
