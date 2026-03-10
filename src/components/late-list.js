import { apiKey, baseURL } from "./utils.js";

export default class LateList extends HTMLElement {
    constructor() {
        super();
        this.stations = [];
        this.delay = [];
        this.from = [];

        this.late = [];
    }

    // connect component
    async connectedCallback() {
        let response = await fetch(`${baseURL}/delayed?api_key=${apiKey}`);
        let result = await response.json();

        this.delay = result.data;
        response = await fetch(`${baseURL}/stations?api_key=${apiKey}`);
        result = await response.json();
        this.stations = result.data;
        this.delay.forEach(element => {
            this.stations.forEach(element2 => {
                if (element.LocationSignature === element2.LocationSignature)
                    this.late.push(element2)
            });
        });
        this.render();
    }

    render() {
        const list = this.late.map(lateItem => {
            const matching = this.delay.find(d => d.LocationSignature === lateItem.LocationSignature);
            return `<single-late late='${JSON.stringify(lateItem)}' delay='${JSON.stringify(matching)}''></single-late>`;
        }).join("");

        this.innerHTML = `<h2>Akuta störningar</h2>${list}`;
    }
}