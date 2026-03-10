import Router from "./router.js";

export default class Navigation extends HTMLElement {
    constructor() {
        super();

        this.router = new Router();
    }

    // connect component
    connectedCallback() {
        const routes = this.router.routes;

        let navigationLinks = "";
        
        for (let path in routes) {
            let active = "";
            if (routes[path].name === "Sök") {
                active = "active";
            }
            if (routes[path].name) {
                navigationLinks += `<a href='#${path}' class="${active}"><i class="${routes[path].icon}"></i>${routes[path].name}</a>`;
            }
        }

        this.innerHTML = `<nav class="bottom-nav">${navigationLinks}</nav>`;
    }
}