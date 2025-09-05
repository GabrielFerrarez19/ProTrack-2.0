import type { TypeButton } from "../@types/types.components";

export function Button({ Text, type, onClick, disabled }: TypeButton) {
  return (
    <button
      className={`w-91 h-9 rounded-xl font-semibold ${
        disabled
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : "cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] text-white hover:from-[#7A9BFD] hover:to-[#B597F9]"
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {Text}
    </button>
  );
}
