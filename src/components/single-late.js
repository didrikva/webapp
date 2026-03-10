export default class SingleLate extends HTMLElement {
    // component attributes
    static get observedAttributes() {
        return ['late'];
    }

    get late() {
        return JSON.parse(this.getAttribute("late"));
    }
    get delay() {
        return JSON.parse(this.getAttribute("delay"));
    }
    get stations() {
        return JSON.parse(this.getAttribute("stations"));
    }

    // connect component
    connectedCallback() {
        const first = new Date(this.delay.AdvertisedTimeAtLocation);
        const late = new Date(this.delay.EstimatedTimeAtLocation);
        const diff = late - first;
        const diffMin = Math.round(diff / 60000);
        this.innerHTML = `
        <div class="error-box">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div class="error-message">
        <h2>${this.delay.AdvertisedTimeAtLocation.split("T")[0]}</h2>
        <h3>${this.delay.TrainOwner} ${this.delay.OperationalTrainNumber}</h3>
        <h3>Tåget som avgick från ${this.delay.FromLocation?.[0].LocationName || "okänd plats"} beräknas ankomma till ${this.late.AdvertisedLocationName} ${this.delay.AdvertisedTimeAtLocation.split("T")[1].split(".")[0]}</h3>
        <h2><i class="fa-solid fa-clock"></i>  ${diffMin} minuter sen</h2>
        </div>
        </div>`;
    }
}