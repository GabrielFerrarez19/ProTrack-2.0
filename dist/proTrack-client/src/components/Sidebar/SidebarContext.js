"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSidebar = exports.SidebarContext = void 0;
const react_1 = require("react");
exports.SidebarContext = (0, react_1.createContext)({
    expanded: true,
});
const useSidebar = () => (0, react_1.useContext)(exports.SidebarContext);
exports.useSidebar = useSidebar;
