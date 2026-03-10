export default class MapOrder extends HTMLElement {
    constructor() {
        super();
        this.order = 0;
    }

    // component attributes
    static get observedAttributes() {
        return ['order'];
    }

    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[property] = newValue;
    }

    // connect component
    async connectedCallback() {
        
        
        this.innerHTML = `<map-view></map-view>`;
        
        
    }
}

const products = document.createElement("products")

document.body.append(products)
