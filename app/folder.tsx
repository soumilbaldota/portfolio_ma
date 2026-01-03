"use-client";
import Image from 'next/image';

// export function FolderIcon({ scale = 1, name = ""}) {
//   return (
//     <div className='hover:bg-zinc-700 rounded-2xl'>    
    
//       <div
//         className="relative m-5 mt-8"
//         style={{ transform: `scale(${scale})` }}
//       >
//         <div className="flex flex-col items-center">
//           <div className="bg-sky-600 rounded-sm h-22 w-35 relative z-10 drop-shadow-2xl mb-2" />
//           <div className="text-xl font-mono text-center">{name}</div>
//         </div>
//         <div className="absolute bg-sky-700 h-10 w-15 -top-3 z-0 rounded-sm" />
//         <div className="absolute bg-sky-700 h-10 w-15 -top-0.5 left-11 z-0 rounded-sm rotate-25" />
//         <div className="absolute bg-sky-700 h-10 w-35 -top-1 z-0 rounded-sm" />
//         <div className="absolute bg-sky-500 h-px w-35 top-20 z-12 drop-shadow-2xl" />
//         <div className="absolute bg-sky-500 h-px w-35 top-21 z-12 drop-shadow-2xl" />
//       </div>
//     </div>

//   )
// }
export function FolderIconWithImage({
  scale = 1,
  name = "",
  image = "",
  onClick = () => {},
  showMinimizedIndicator = false,
}: {
  scale?: number;
  name?: string;
  image?: string;
  onClick?: () => void;
  showMinimizedIndicator?: boolean;
}) {
  return (
    <div className="hover:bg-surface-tertiary rounded-2xl cursor-pointer" onClick={onClick}>
      <div className="relative m-5 mt-8" style={{ transform: `scale(${scale})` }}>
        <div className="flex flex-col items-center">
          <div className="bg-accent-secondary rounded-sm h-22 w-35 relative z-10 drop-shadow-2xl mb-2 flex justify-center items-center">
            {image && (
              <div className="rounded-full overflow-hidden w-15 h-15">
                <Image
                  src={image}
                  alt={name}
                  width={70}
                  height={70}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="text-xl font-mono text-center">{name}</div>
          {/* Minimized indicator - tiny dot below the folder name */}
          {showMinimizedIndicator && (
            <div 
              className="w-2 h-2 rounded-full bg-yellow-500 mt-1" 
              role="status"
              aria-label="Window is minimized"
            />
          )}
        </div>
        {/* Decorative folder elements */}
        <div className="absolute bg-accent-tertiary h-10 w-15 -top-3 z-0 rounded-sm" />
        <div className="absolute bg-accent-tertiary h-10 w-15 -top-0.5 left-11 z-0 rounded-sm rotate-25" />
        <div className="absolute bg-accent-tertiary h-10 w-35 -top-1 z-0 rounded-sm" />
        <div className="absolute bg-accent-primary h-px w-35 top-20 z-12 drop-shadow-2xl" />
        <div className="absolute bg-accent-primary h-px w-35 top-21 z-12 drop-shadow-2xl" />
      </div>
    </div>
  );
}
