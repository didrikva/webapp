export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = "";
        this.wildcard = "";

        this.allRoutes = {
            "": {
                view: "<map-order></map-order>",
                name: "Sök",
                icon: "fa-solid fa-magnifying-glass",
            },
            "message": {
                view: "<late-view></late-view>",
                name: "Meddelanden",
                icon: "fas fa-comment-dots",
            }
        };
    }

    get routes() {
        return this.allRoutes;
    }

    // connect component
    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
            const allLinks = document.querySelectorAll("navigation-outlet a");
            allLinks.forEach(link => {
                link.classList.remove("active");
                const linkHash = link.getAttribute('href').replace('#', '');
                if (this.currentRoute === linkHash)
                    link.classList.add("active");
            })
        });

        this.resolveRoute();
    }

    resolveRoute() {
        let cleanHash = location.hash.replace("#", "");
        if (cleanHash.includes("/")) {
            let splitHash = cleanHash.split("/")
            this.currentRoute = splitHash[0];
            this.wildcard = splitHash[1];
        } else {
            this.currentRoute = cleanHash;
        }
        this.render();
    }

    render() {
        let html = "<not-found></not-found>";
        // console.log(this.routes[this.currentRoute])
        if (this.routes[this.currentRoute]) {
            html = this.routes[this.currentRoute].view;
        }
        this.innerHTML = html
    }
}