import { useState } from "react";
import { SidebarContext } from "./SidebarContext";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import img from "../../assets/Logo.svg";

type SidebarProps = {
  children: React.ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen sidebar relative z-1">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={img}
            className={` overflow-hidden transition-all ${
              expanded ? "w-22" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* Footer */}
        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Gabriel Ferrarez</h4>
              <span className="text-xs text-gray-600">
                gabrielferrarez@gmail.com
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}
