"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = SearchBar;
const lucide_react_1 = require("lucide-react");
const input_1 = require("../../../components/ui/input");
const button_1 = require("../../../components/ui/button");
function SearchBar({ searchTerm, onChange }) {
    return (<div className="flex gap-3 items-center">
      <div className="relative flex-1 max-w-md">
        <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
        <input_1.Input placeholder="Pesquise um cliente..." value={searchTerm} onChange={(e) => onChange(e.target.value)} className="pl-10 bg-input border-border"/>
      </div>
      <button_1.Button variant="outline" className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 border-blue-500">
        <lucide_react_1.Filter className="w-4 h-4"/>
        Filtro
      </button_1.Button>
    </div>);
}
