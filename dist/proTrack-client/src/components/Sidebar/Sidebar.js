"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
const react_1 = require("react");
const SidebarContext_1 = require("./SidebarContext");
const lucide_react_1 = require("lucide-react");
const Logo_svg_1 = __importDefault(require("../../assets/Logo.svg"));
function Sidebar({ children }) {
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    return (<aside className="h-screen sidebar relative z-1">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <Logo_svg_1.default src={Logo_svg_1.default} className={` overflow-hidden transition-all ${expanded ? "w-22" : "w-0"}`} alt="Logo"/>
          <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
            {expanded ? <lucide_react_1.ChevronFirst /> : <lucide_react_1.ChevronLast />}
          </button>
        </div>

        {/* Items */}
        <SidebarContext_1.SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext_1.SidebarContext.Provider>

        {/* Footer */}
        <div className="border-t flex p-3">
          <Logo_svg_1.default src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="Avatar" className="w-10 h-10 rounded-md"/>
          <div className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}>
            <div className="leading-4">
              <h4 className="font-semibold">Gabriel Ferrarez</h4>
              <span className="text-xs text-gray-600">
                gabrielferrarez@gmail.com
              </span>
            </div>
            <lucide_react_1.MoreVertical size={20}/>
          </div>
        </div>
      </nav>
    </aside>);
}
