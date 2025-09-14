import React from 'react';
import type { Slide } from '../types';
import { Infographic } from './Infographic';

interface SlideRendererProps {
  slide: Slide;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  return (
    <div 
        id={`slide-for-export-${slide.id}`}
        // We use fixed dimensions for consistent capturing with html2canvas
        className="w-[1280px] h-[720px] bg-gray-800 overflow-hidden relative flex flex-col justify-center items-center text-white"
    >
        <img src={slide.imageUrl} alt={slide.image_prompt} className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10"></div>
        
        <div className="relative z-20 w-full h-full p-20 flex flex-col justify-center">
            <div className={`${slide.title.fontSize} ${slide.title.fontFamily} font-bold tracking-tighter mb-6 text-white text-shadow-md text-center`}>
                {slide.title.text}
            </div>

            {slide.slideType === 'infographic' && slide.infographic && (
                <div className="flex-grow flex items-center justify-center">
                    <Infographic infographic={slide.infographic} />
                </div>
            )}
            
            {slide.slideType === 'content' && (
                <ul className="space-y-4">
                    {slide.content?.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className={`${item.fontSize} text-primary flex-shrink-0 mt-1`}>&#8226;</span>
                            <div className={`${item.fontSize} ${item.fontFamily} text-gray-200 text-shadow flex-grow`}>
                                {item.text}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  );
};