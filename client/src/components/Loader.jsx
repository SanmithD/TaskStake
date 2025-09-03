import { Loader2 } from "lucide-react";

function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
      <span className="text-sm font-medium text-gray-600">{text}</span>
      <progress className="progress w-56 mt-3"></progress>
    </div>
  );
}

export default Loader;
