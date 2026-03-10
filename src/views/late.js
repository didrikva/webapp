export default class LateView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <lager-title title="Didrik"></lager-title>
                             </header>
                             <main class="main">
                                <late-list class="late-trains"></late-list>
                             </main>
                             `;
    }
}