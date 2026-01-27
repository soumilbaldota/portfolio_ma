import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen w-screen fixed inset-0 bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 
          className="animate-spin text-accent-primary" 
          size={48}
          strokeWidth={2.5}
        />
        <p className="text-text-secondary font-mono text-sm">Loading portfolio...</p>
      </div>
    </div>
  );
}
