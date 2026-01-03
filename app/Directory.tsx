import { Bird, Bot, BrainCircuit, Cylinder, Globe } from "lucide-react";

function Sidebar() {
    return (
        <div className="bg-zinc-800/20 backdrop-blur-2xl flex flex-col">
            <div className=" p-2 font-mono bg-zinc-800/30 flex items-center hover:bg-blue-500">
                <Bot className='mr-2'/> Robotics
            </div>
            <div className="p-2 font-mono bg-zinc-800/30 flex items-center hover:bg-blue-500">
                <BrainCircuit className='mr-2'/>  ML
            </div>
            <div className="p-2 font-mono bg-zinc-800/30 flex items-center hover:bg-blue-500">
                <Globe className='mr-2'/>  FullStack
            </div>
            <div className="p-2 font-mono bg-zinc-800/30 flex items-center hover:bg-blue-500">
                <Bird className='mr-2'/>  Kernel Hacking
            </div>
            <div className="p-2 font-mono bg-zinc-800/30 flex items-center hover:bg-blue-500">
                <Cylinder className='mr-2'/>  DB
            </div>
        </div>
    );
}

function VideoThumbnailIcon() {
    return <div className='h-10 w-12 bg-amber-50 m-5'>

    </div>
}

export function FileArea() {
    return <div className='flex flex-wrap overflow-auto gap-2 items-start content-start'>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
        <VideoThumbnailIcon/>
    </div>
}

export function Directory() {
    return <div className="w-full h-full max-w-200 max-h-92">
        <div className="bg-zinc-950 w-full h-px" />

        <div className="grid grid-cols-[1fr_3fr] h-full w-full ">
            <Sidebar />
            <FileArea />
        </div>
    </div>
}