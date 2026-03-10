export default class SinglePopup extends HTMLElement {
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

    // connect component
    connectedCallback() {
        if (this.delay.error) {
            this.innerHTML = `${this.delay.error}`
        } else {
        const first = new Date(this.delay.AdvertisedTimeAtLocation);
        const late = new Date(this.delay.EstimatedTimeAtLocation);
        const diff = late - first;
        const diffMin = Math.round(diff / 60000);
        this.innerHTML = `
        <h2>${this.late[0].AdvertisedLocationName}</h2>
        <h2><i class="fa-solid fa-clock"></i>  ${diffMin} minuter sen</h2>`;
        }
    }
}