"use client";
import { FolderIconWithImage } from "./folder";
import { useState } from "react";
import { Modal } from "./Modal";
import { Contacts } from './Contact';
import { Projects } from './Projects';
import { AboutMe } from './AboutMe';
import { Work } from './Work';
import { Settings } from './Settings';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Home() {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [activeModal, setActiveModal] = useState<"about" | "work" | "projects" | "contact" | "settings" | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const openPortal = (type: "about" | "work" | "projects" | "contact" | "settings") => {
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
        setModalContent(<div className='rounded-sm w-full h-full'><AboutMe /></div>);
        break;
      case "work":
        setModalContent(<div className='rounded-sm w-full h-full'><Work /></div>);
        break;
      case "projects":
        setModalContent(<div className='rounded-sm w-full h-full'><Projects /></div>);
        break;
      case "contact":
        setModalContent(<div className='rounded-sm w-full h-full'><Contacts /></div>);
        break;
      case "settings":
        setModalContent(<div className='rounded-sm w-full h-full'><Settings /></div>);
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
    <div className="flex justify-center items-center h-screen overflow-hidden relative">
      {/* Settings button in top-right corner */}
      <button
        onClick={() => openPortal("settings")}
        className="absolute top-4 right-4 p-2 rounded-lg bg-surface-primary/80 backdrop-blur-lg border border-border transition-all hover:bg-surface-secondary z-10"
        aria-label="Settings"
      >
        <SettingsIcon size={20} className="text-text-primary" />
      </button>

      <div className="min-w-250 rounded-xl flex flex-wrap items-center justify-center gap-4 overflow-auto backdrop-blur-lg bg-surface-primary/80 p-4">
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
          title={activeModal ? activeModal.charAt(0).toUpperCase() + activeModal.slice(1) : undefined}
        >
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
