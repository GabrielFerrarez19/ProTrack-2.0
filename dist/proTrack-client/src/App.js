"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = App;
const react_router_dom_1 = require("react-router-dom");
const Router_1 = require("./Router");
require("./index.css");
function App() {
    return (<react_router_dom_1.BrowserRouter>
      <Router_1.Router />
    </react_router_dom_1.BrowserRouter>);
}
