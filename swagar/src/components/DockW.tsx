// src/components/DockWrapper.tsx
'use client';

import React from 'react';
import Dock from '@/components/ui/Docker'; // Adjust path if necessary
import { VscHome, VscArchive} from 'react-icons/vsc';


const dockItems = [
  { icon: <VscHome size={16} />, label: "Home", onClick: () => window.location.href = "/" },
  { icon: <VscArchive size={18} />, label: "Try-on", onClick: () => window.location.href = "/virtual-tryon" },
 
  
];

export default function DockWrapper() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      <Dock 
        items={dockItems}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
    </div>
  );
}
