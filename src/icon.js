import L from "leaflet";
import icon from './images/icon-location.svg';

export default L.icon({
    iconUrl: icon,
    iconSize: [35, 40],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
})