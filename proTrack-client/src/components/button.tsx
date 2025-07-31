import type { TypeButton } from "../@types/types.components";

export function Button({ Text, type }: TypeButton) {
  return (
    <button
      className="w-91 h-9 rounded-xl cursor-pointer bg-gradient-to-r from-[#628DFD] to-[#6F31FF] 
      text-white font-semibold hover:from-[#7A9BFD] hover:to-[#B597F9]"
      type={type}
    >
      {Text}
    </button>
  );
}
