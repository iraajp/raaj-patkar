import React from 'react';
import { useEffect } from 'react';
import type { Presentation } from '../types';
import { SlideRenderer } from './SlideRenderer';

declare global {
    interface Window {
        html2canvas: any;
        jspdf: any;
    }
}

interface PresentationExporterProps {
  presentation: Presentation;
  onComplete: () => void;
}

export const PresentationExporter: React.FC<PresentationExporterProps> = ({ presentation, onComplete }) => {

  useEffect(() => {
    const exportToPdf = async () => {
      const { jsPDF } = window.jspdf;
      // PDF will be in landscape, with dimensions matching the slides
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 720]
      });

      for (let i = 0; i < presentation.slides.length; i++) {
        const slide = presentation.slides[i];
        const element = document.getElementById(`slide-for-export-${slide.id}`);
        
        if (element) {
          const canvas = await window.html2canvas(element, {
            // Options to improve image quality
            scale: 2, 
            useCORS: true,
            allowTaint: true,
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          
          if (i > 0) {
            pdf.addPage([1280, 720], 'landscape');
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, 1280, 720);
        }
      }

      pdf.save(`${presentation.title.replace(/\s+/g, '_') || 'presentation'}.pdf`);
      onComplete();
    };

    // Timeout to ensure the component has rendered before capturing
    const timer = setTimeout(exportToPdf, 100);

    return () => clearTimeout(timer);
  }, [presentation, onComplete]);

  return (
    // This container is rendered off-screen
    <div className="absolute top-0 left-[-9999px] z-0">
        <div className="flex flex-col">
        {presentation.slides.map((slide) => (
            <SlideRenderer key={slide.id} slide={slide} />
        ))}
        </div>
    </div>
  );
};