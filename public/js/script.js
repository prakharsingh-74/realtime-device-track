let socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current Location:", latitude, longitude);
        socket.emit("send-location", { latitude, longitude });
        map.setView([latitude, longitude], 10);
        if (!markers["self"]) {
            markers["self"] = L.marker([latitude, longitude]).addTo(map);
        } else {
            markers["self"].setLatLng([latitude, longitude]);
        }
    }, (error) => {
        console.error("Error getting location:", error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
} else {
    console.error("Geolocation is not supported by this browser.");
}


// Initialize the Leaflet map
const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Made with ❤️ by Prakhar Singh"
}).addTo(map);

const markers = {};

socket.on("recieve-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 10);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})

socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})