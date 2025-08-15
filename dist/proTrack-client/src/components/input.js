"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = Input;
function Input({ TextLabel, type, value, onChange }) {
    return (<div className="flex flex-col">
      <label htmlFor="" className="font-semibold text-[var(--blue-800)]">
        {TextLabel}
      </label>
      <input type={type} className="w-91 h-9 border-2 border-[var(--zinc-input)] rounded-xl p-1 focus: outline-none" value={value} onChange={onChange}/>
    </div>);
}
