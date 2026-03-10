import Router from "./router.js";
import Navigation from "./navigation.js";
import LateView from "./views/late.js";
import LateList from "./components/late-list.js";
import SingleLate from "./components/single-late.js";
import SinglePopup from "./components/single-popup.js";
import MapOrder from "./components/map.js";
import MapView from "./components/map-view.js";

customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('late-view', LateView);
customElements.define('late-list', LateList);
customElements.define('single-late', SingleLate);
customElements.define('single-popup', SinglePopup);
customElements.define('map-order', MapOrder);
customElements.define('map-view', MapView);
