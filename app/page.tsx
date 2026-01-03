"use client";
import { FolderIconWithImage } from "./folder";
import { useState } from "react";
import { Modal } from "./Modal";
import { Contacts } from './Contact';
import { Project } from "./Project";

export default function Home() {
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
        setModalContent(<div className='rounded-sm w-200 h-92'>About Me Content Here</div>);
        break;
      case "work":
        setModalContent(<div className='rounded-sm w-200 h-92'>Work Content Here</div>);
        break;
      case "projects":
        setModalContent(<div className='rounded-sm w-200 h-92'><Project/></div>);
        break;
      case "contact":
        setModalContent(<div className='rounded-sm w-200 h-92'><Contacts /></div>);
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
      <div className="max-w-100 min-w-300 min-h-50 max-h-50 rounded-xl flex flex-wrap items-center justify-center gap-4 overflow-auto backdrop-blur-lg bg-surface-secondary p-4">
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
        >
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
