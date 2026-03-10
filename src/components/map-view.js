/* global L */

import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { apiKey, baseURL } from "../components/utils.js";
export default class MapView extends HTMLElement {
    constructor() {
        super();
        this.trainId = [];
        this.markers = new Map();
        this.map = null;
        this.stations = [];
        this.delay = [];
        this.formValue = "Välj tåg";
        this.searched = [];
        this.late = [];
    }

    async connectedCallback() {
        this.innerHTML = `<div id="map" class="map"></div>`;
        this.updateAPI()
        this.renderMap();
        this.init();
    }

    renderMap() {
        this.map = L.map('map').setView([56.2345, 15.6034], 11);
        var circleCenter = [56.2345, 15.6034];
        var radius = 0
        this.circle = L.circle(circleCenter, radius, {
        }).addTo(this.map);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.renderLocation();
    }

    renderLocation() {
        // let locationMarker = L.icon({
        //     iconUrl:      "./src/components/location.png",
        //     iconSize:     [24, 24],
        //     iconAnchor:   [12, 12],
        //     popupAnchor:  [0, 0]
        // });


        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                L.marker(
                    [position.coords.latitude,                  position.coords.longitude],
                ).addTo(this.map)
                .bindTooltip("Din position", {
                    permanent: true,
                    direction: "top",
                    offset: [-15, -10]
                });
                this.map.setView([position.coords.latitude, position.coords.longitude], 12);
            });
            
        }
    }
    async updateAPI() {
        this.late = [];
        let response = await fetch(`${baseURL}/delayed?api_key=${apiKey}`);
        let result = await response.json();

        this.delay = result.data;
        response = await fetch(`${baseURL}/stations?api_key=${apiKey}`);
        result = await response.json();
        this.stations = result.data;
        this.delay.forEach(element => {
            this.stations.forEach(element2 => {
                if (element.LocationSignature === element2.LocationSignature) {
                    element2["AdvertisedTrainIdent"] = element.AdvertisedTrainIdent
                    element2["AdvertisedTimeAtLocation"] = element.AdvertisedTimeAtLocation
                    element2["EstimatedTimeAtLocation"] = element.EstimatedTimeAtLocation
                    this.late.push(element2)
                }
            });
        });
        this.explore();
    }
    init() {
        const socket = io("https://trafik.emilfolino.se");
    
        socket.on("position", (data) => {
            if (this.markers.has(data.train)) {
                const remove = this.markers.get(data.train);
                this.map.removeLayer(remove);
            }
            const marker = L.marker([data.position[0], data.position[1]])
                .addTo(this.map)
                .bindPopup(this.info(data.train));
            this.markers.set(data.train, marker);
        });
    }

    info(id) {
        let matching = this.delay.find(d => d.AdvertisedTrainIdent === id);
        let lateItem = [];
        this.late.forEach(late => {
            if (!matching) {
                return
            } else {
                if (late.LocationSignature === matching.LocationSignature) {
                    lateItem.push(late);
                }
            }
        });
        const popup = document.createElement("single-popup");
        if (!matching) {
            popup.setAttribute("delay", JSON.stringify({ error: "Ingen information hittad" }));
        } else {
            popup.setAttribute("delay", JSON.stringify(matching));
        }
        popup.setAttribute("late", JSON.stringify(lateItem));
        lateItem = [];
        return popup
    }
    explore() {
        const formCheck = this.querySelector("form");
        if (formCheck) {
            formCheck.remove()
        }
        let form = document.createElement("form");
        let formHeader = document.createElement("h1")
        formHeader.textContent = "Sök resa";
        form.appendChild(formHeader)
        this.appendChild(form);
        let defualt = document.createElement("option");
        defualt.textContent = this.formValue;
        let select = document.createElement("select");
        select.classList.add("styled-input");
        select.appendChild(defualt)
        this.late.forEach(late => {
            let option = document.createElement("option");
            let split = late.Geometry.WGS84.replace("(", "").replace(")", "").split(" ")
            option.value = JSON.stringify({
                name: `Tåg: ${late.AdvertisedTrainIdent}, Mot: ${late.AdvertisedLocationName}`,
                lat: split[1],
                lon: split[2],
                ad: late.AdvertisedTimeAtLocation,
                ex: late.EstimatedTimeAtLocation
            });
            option.textContent = `Tåg: ${late.AdvertisedTrainIdent}, Mot: ${late.AdvertisedLocationName} `;
            select.appendChild(option);
        });
        select.addEventListener("change", (event) => {
            let jssonValue = JSON.parse(event.target.value)
            this.formValue = jssonValue.name
            this.map.setView([jssonValue.lon, jssonValue.lat], 12);
            this.searched.push(jssonValue.name)
            this.updateAPI();
            this.circle.remove();
            var circleCenter = [jssonValue.lon, jssonValue.lat];
            const diff = new Date(jssonValue.ex) - new Date(jssonValue.ad);
            const diffMin = Math.round(diff / 60000) - 1;
            var radius = diffMin * 50;
            this.circle = L.circle(circleCenter, radius, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5
            }).addTo(this.map);
        })
        form.appendChild(select);
        formHeader = document.createElement("h1")
        formHeader.textContent = "Sökta resor";
        form.appendChild(formHeader)
        this.searched.forEach(search => {
                let searched = document.createElement("h4");
                searched.textContent = search;
                const newElement = form.querySelector("h4");
                form.insertBefore(searched, newElement)
        })
    }
}