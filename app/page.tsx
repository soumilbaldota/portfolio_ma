"use client";
import { FolderIconWithImage } from "./folder";
import { WorkBubbles } from "./WorkBubbles";
import { useState } from "react";
import { Modal } from "./Modal";
import { Contacts } from './Contact';
import { Projects } from './Projects';
import { AboutMe } from './AboutMe';
import { Work } from './Work';
import { Settings } from './Settings';
import { Settings as SettingsIcon } from 'lucide-react';
import { Head3D } from './Head3D';
import { useAccentColor } from './AccentColorContext';
import { FlappyBirdGame } from './FlappyBird';
import { DinoGame } from './DinoGame';
import Image from 'next/image';

export default function Home() {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [activeModal, setActiveModal] = useState<"about" | "work" | "projects" | "contact" | "settings" | "flappybird" | "dinogame" | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { theme } = useAccentColor();

  const openPortal = (type: "about" | "work" | "projects" | "contact" | "settings" | "flappybird" | "dinogame") => {
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
      case "flappybird":
        setModalContent(<div className='rounded-sm w-full h-full'><FlappyBirdGame /></div>);
        break;
      case "dinogame":
        setModalContent(<div className='rounded-sm w-full h-full'><DinoGame /></div>);
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
    <div 
      className="flex justify-center items-center h-screen w-screen overflow-hidden fixed inset-0"
      style={{
        backgroundImage: `url(${theme === 'dark' ? '/background-dark.png' : '/background-light.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 3D Head in top-right corner */}
      <div className="absolute top-0 right-[100px] z-[100px]">
        <Head3D />
      </div>

      {/* Settings button in top-right corner */}
      <button
        onClick={() => openPortal("settings")}
        className="absolute top-4 right-4 p-2 rounded-lg bg-surface-primary/80 backdrop-blur-lg border border-border transition-all hover:bg-surface-secondary z-30"
        aria-label="Settings"
      >
        <SettingsIcon size={20} className="text-text-primary" />
      </button>

      <div className="min-w-250 rounded-xl flex flex-wrap items-center justify-center gap-4 overflow-auto backdrop-blur-lg bg-surface-primary/80 p-4">
        <div 
          className="rounded-2xl cursor-pointer transition-colors bg-transparent hover:bg-surface-secondary/80"
          onClick={() => openPortal("about")}
        >
          <div className="relative m-5 mt-8 px-3.5">
            <div className="flex flex-col items-center">
              <div className="w-22 h-22 rounded-2xl overflow-hidden mb-2 shadow-lg flex items-center justify-center">
                <Image
                  src="/soumil.png"
                  alt="About Me"
                  width={88}
                  height={88}
                  className="object-contain"
                />
              </div>
              <div className="text-xl font-mono text-center">About Me</div>
              {activeModal === "about" && isMinimized && (
                <div 
                  className="w-2 h-2 rounded-full bg-yellow-500 mt-1" 
                  role="status"
                  aria-label="Window is minimized"
                />
              )}
            </div>
          </div>
        </div>
        <WorkBubbles
          onClick={() => openPortal("work")}
          showMinimizedIndicator={activeModal === "work" && isMinimized}
        />
        <FolderIconWithImage
          name="Projects"
          image="/projects.png"
          onClick={() => openPortal("projects")}
          showMinimizedIndicator={activeModal === "projects" && isMinimized}
        />
        <div 
          className="rounded-2xl cursor-pointer transition-colors bg-transparent hover:bg-surface-secondary/80"
          onClick={() => openPortal("contact")}
        >
          <div className="relative m-5 mt-8 px-3.5">
            <div className="flex flex-col items-center">
              <div className="w-22 h-22 rounded-2xl overflow-hidden mb-2 shadow-lg flex items-center justify-center">
                <Image
                  src="/contact.png"
                  alt="Contact Me"
                  width={88}
                  height={88}
                  className="object-contain"
                />
              </div>
              <div className="text-xl font-mono text-center">Contact Me</div>
              {activeModal === "contact" && isMinimized && (
                <div 
                  className="w-2 h-2 rounded-full bg-yellow-500 mt-1" 
                  role="status"
                  aria-label="Window is minimized"
                />
              )}
            </div>
          </div>
        </div>
        <div 
          className="rounded-2xl cursor-pointer transition-colors bg-transparent hover:bg-surface-secondary/80"
          onClick={() => openPortal("flappybird")}
        >
          <div className="relative m-5 mt-8 px-3.5">
            <div className="flex flex-col items-center">
              <div className="w-22 h-22 rounded-2xl overflow-hidden mb-2 shadow-lg flex items-center justify-center" style={{ backgroundColor: '#70c5cd' }}>
                <Image
                  src="/bird.png"
                  alt="Flappy Bird"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="text-xl font-mono text-center">Flappy Bird</div>
              {activeModal === "flappybird" && isMinimized && (
                <div 
                  className="w-2 h-2 rounded-full bg-yellow-500 mt-1" 
                  role="status"
                  aria-label="Window is minimized"
                />
              )}
            </div>
          </div>
        </div>
        <div 
          className="rounded-2xl cursor-pointer transition-colors bg-transparent hover:bg-surface-secondary/80"
          onClick={() => openPortal("dinogame")}
        >
          <div className="relative m-5 mt-8 px-3.5">
            <div className="flex flex-col items-center">
              <div className="w-22 h-22 rounded-2xl overflow-hidden mb-2 shadow-lg bg-orange-50 flex items-center justify-center">
                <Image
                  src="/dino.png"
                  alt="Dino Game"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="text-xl font-mono text-center">Dino Game</div>
              {activeModal === "dinogame" && isMinimized && (
                <div 
                  className="w-2 h-2 rounded-full bg-yellow-500 mt-1" 
                  role="status"
                  aria-label="Window is minimized"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {modalContent && !isMinimized && (
        <Modal 
          onClose={closeModal} 
          onMinimize={minimizeModal} 
          onMaximize={maximizeModal}
          isMaximized={isMaximized}
          size={activeModal === "flappybird" || activeModal === "dinogame" ? "small" : "medium"}
          title={activeModal ? activeModal.charAt(0).toUpperCase() + activeModal.slice(1) : undefined}
        >
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
