"use client";
import { FolderIconWithImage } from "./folder";
import { useState } from "react";
import { Modal } from "./Modal";
import { Contacts } from './Contact';
import { Projects } from './Projects';

export default function Home() {
  const [modalArea, setModalArea] = useState([200, 100]);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [activeModal, setActiveModal] = useState<"about" | "work" | "projects" | "contact" | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const openPortal = (type: "about" | "work" | "projects" | "contact") => {
    // If clicking on a minimized modal, restore it
    if (activeModal === type && isMinimized) {
      setIsMinimized(false);
      return;
    }

    setActiveModal(type);
    setIsMinimized(false);
    setIsMaximized(false);

    switch (type) {
      case "about":
        setModalArea([200, 100]);
        setModalContent(<div className='rounded-sm w-full h-full'>About Me Content Here</div>);
        break;
      case "work":
        setModalArea([200, 100]);
        setModalContent(<div className='rounded-sm w-full h-full'>Work Content Here</div>);
        break;
      case "projects":
        setModalArea([300, 150]);
        setModalContent(<div className='rounded-sm w-full h-full'><Projects /></div>);
        break;
      case "contact":
        setModalArea([200, 100]);
        setModalContent(<div className='rounded-sm w-full h-full'><Contacts /></div>);
        break;
    }
  };

  const closeModal = () => {
    setModalContent(null);
    setActiveModal(null);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const minimizeModal = () => {
    setIsMinimized(true);
  };

  const maximizeModal = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <div className="max-w-100 min-w-300 min-h-50 max-h-50 rounded-xl flex flex-wrap items-center justify-center gap-4 overflow-auto backdrop-blur-lg bg-surface-primary p-4">
        <FolderIconWithImage
          name="About Me"
          image="/soumil.png"
          onClick={() => openPortal("about")}
          showMinimizedIndicator={activeModal === "about" && isMinimized}
        />
        <FolderIconWithImage
          name="Work"
          image="/work.png"
          onClick={() => openPortal("work")}
          showMinimizedIndicator={activeModal === "work" && isMinimized}
        />
        <FolderIconWithImage
          name="Projects"
          image="/projects.png"
          onClick={() => openPortal("projects")}
          showMinimizedIndicator={activeModal === "projects" && isMinimized}
        />
        <FolderIconWithImage
          name="Contact Me"
          image="/contact.png"
          onClick={() => openPortal("contact")}
          showMinimizedIndicator={activeModal === "contact" && isMinimized}
        />
      </div>
      {modalContent && !isMinimized && (
        <Modal 
          onClose={closeModal} 
          onMinimize={minimizeModal} 
          onMaximize={maximizeModal}
          isMaximized={isMaximized}
          height={modalArea[1]}
          width={modalArea[0]}
        >
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
