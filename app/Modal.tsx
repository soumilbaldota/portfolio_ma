import { createPortal } from "react-dom";

function TrafficLight({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <div
      className={`h-3 w-3 rounded-full ${color} m-1 flex items-center justify-center cursor-pointer group`}
      onClick={onClick}
    >
      <div className="bg-white w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className='h-8 w-200 bg-zinc-800/95 rounded-t-sm flex items-center'>
      <TrafficLight color="bg-red-500" onClick={onClose} />
      <TrafficLight color="bg-yellow-500" />
      <TrafficLight color="bg-green-500" />
    </div>
  );
}
export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return createPortal(
    <div className='fixed inset-0 flex justify-center items-center z-50' onClick={onClose}>
      <div>

        <div
          className="m-0 p-0 rounded-sm w-200 h-100 backdrop-blur-2xl bg-zinc-800/30 border-0 border-black"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader onClose={onClose} />
          {children}
        </div>

      </div>
    </div>
    ,
    document.body
  );
}