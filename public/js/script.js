const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("send-location", { latitude, longitude });
  },
  (error) => {
    console.error(error);
  },{
    enableHighAccuracy:true,
    timeout:5000,
    maximumAge:0,
  })
    
}

const map = L.map("map").setView([0,0],60)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"harsh developer"
}).addTo(map)

const markers = {}
socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude])
    if (markers[id]) {
        markers[id].setLetLang([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on("user-dicsonnected",(id)=>{
     if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
     }
})
