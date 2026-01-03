"use client";
import { FolderIconWithImage } from "./folder";
import { useState } from "react";
import { Modal } from "./Modal";
import { Contacts } from './Contact';
import { Project } from "./Project";

export default function Home() {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  const openPortal = (type: "about" | "work" | "projects" | "contact") => {
    switch (type) {
      case "about":
        setModalContent(<div className='rounded-sm w-200 h-92 border-0 border-black'>About Me Content Here</div>);
        break;
      case "work":
        setModalContent(<div className='rounded-sm w-200 h-92 border-0 border-black'>Work Content Here</div>);
        break;
      case "projects":
        setModalContent(<div className='rounded-sm w-200 h-92 border-0 border-black'><Project/></div>);
        break;
      case "contact":
        setModalContent(<div className='rounded-sm w-200 h-92 border-0 border-black'><Contacts /></div>);
        break;
    }
  };


  const closeModal = () => setModalContent(null);

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <div className="max-w-100 min-w-300 min-h-50 max-h-50 rounded-xl flex flex-wrap items-center justify-center gap-4 overflow-auto backdrop-blur-lg bg-zinc-900 p-4">
        <FolderIconWithImage
          name="About Me"
          image="/soumil.png"
          onClick={() => openPortal("about")}
        />
        <FolderIconWithImage
          name="Work"
          image="/work.png"
          onClick={() => openPortal("work")}
        />
        <FolderIconWithImage
          name="Projects"
          image="/projects.png"
          onClick={() => openPortal("projects")}
        />
        <FolderIconWithImage
          name="Contact Me"
          image="/contact.png"
          onClick={() => openPortal("contact")}
        />
      </div>
      {modalContent && <Modal onClose={closeModal}>{modalContent}</Modal>}
    </div>
  );
}
