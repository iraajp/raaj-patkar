import React, { useState, useRef, useEffect } from 'react';
import type { Presentation, Slide, StyledText, Infographic as InfographicType } from '../types';
import { EditableText } from './EditableText';
import { Icon } from './Icon';
import { generateImage } from '../services/geminiService';
import { Infographic } from './Infographic';

interface SidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onReorderSlides: (dragIndex: number, dropIndex: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ slides, currentSlideIndex, onSelectSlide, onAddSlide, onReorderSlides }) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (index !== draggedIndex) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            onReorderSlides(draggedIndex, dropIndex);
        }
        handleDragEnd();
    };


    return (
        <div className="w-64 bg-gray-900 flex-shrink-0 p-4 flex flex-col">
            <h3 className="text-white font-bold mb-4 text-lg">Slides</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className="relative"
                    >
                         {dragOverIndex === index && draggedIndex !== index && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary z-10 -mt-1.5 rounded-full" />
                        )}
                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onSelectSlide(index)}
                            className={`relative rounded-lg overflow-hidden cursor-grab mb-3 border-2 transition-all duration-300 ${
                                currentSlideIndex === index ? 'border-primary' : 'border-gray-700 hover:border-primary/70'
                            } ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}`}
                        >
                            <div className="absolute top-2 left-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                {index + 1}
                            </div>
                            <img src={slide.imageUrl} alt={slide.title.text} className="w-full h-auto aspect-video object-cover" />
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={onAddSlide} 
                className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-primary-hover">
                <Icon name="add" className="w-5 h-5"/>
                Add Slide
            </button>
        </div>
    );
};

const InfographicEditor: React.FC<{
    infographic: InfographicType;
    onInfographicChange: (newInfographic: InfographicType) => void;
    onClose: () => void;
}> = ({ infographic, onInfographicChange, onClose }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const lastDataLength = useRef(infographic.data.length);
    
    useEffect(() => {
        if (infographic.data.length > lastDataLength.current) {
            const inputs = listRef.current?.querySelectorAll('input[type="text"]');
            const lastInput = inputs?.[inputs.length - 1] as HTMLInputElement | null;
            lastInput?.focus();
            lastInput?.select();
        }
        lastDataLength.current = infographic.data.length;
    }, [infographic.data.length]);

    const handleTypeChange = (type: 'pie' | 'bar') => {
        onInfographicChange({ ...infographic, type });
    };

    const handleDataChange = (index: number, field: 'label' | 'value', value: string | number) => {
        const newData = [...infographic.data];
        if (field === 'value') {
            const numValue = Number(value);
            newData[index] = { ...newData[index], [field]: isNaN(numValue) ? 0 : numValue };
        } else {
            newData[index] = { ...newData[index], [field]: value as string };
        }
        onInfographicChange({ ...infographic, data: newData });
    };

    const handleAddDataPoint = () => {
        const newData = [...infographic.data, { label: 'New Entry', value: 10 }];
        onInfographicChange({ ...infographic, data: newData });
    };

    const handleDeleteDataPoint = (index: number) => {
        const newData = infographic.data.filter((_, i) => i !== index);
        onInfographicChange({ ...infographic, data: newData });
    };

    return (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold font-display">Edit Infographic</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <Icon name="close" className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Chart Type</label>
                        <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
                            <button
                                onClick={() => handleTypeChange('pie')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${infographic.type === 'pie' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}
                            >Pie Chart</button>
                            <button
                                onClick={() => handleTypeChange('bar')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${infographic.type === 'bar' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}
                            >Bar Chart</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Data Points</label>
                        <div className="space-y-3" ref={listRef}>
                            {infographic.data.map((point, index) => (
                                <div key={index} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg group">
                                    <input
                                        type="text"
                                        value={point.label}
                                        onChange={(e) => handleDataChange(index, 'label', e.target.value)}
                                        placeholder="Label"
                                        className="bg-gray-700 rounded-md px-3 py-2 text-white w-2/3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label={`Label for data point ${index + 1}`}
                                    />
                                    <input
                                        type="number"
                                        value={point.value}
                                        onChange={(e) => handleDataChange(index, 'value', e.target.value)}
                                        placeholder="Value"
                                        className="bg-gray-700 rounded-md px-3 py-2 text-white w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label={`Value for data point ${index + 1}`}
                                    />
                                    <button
                                        onClick={() => handleDeleteDataPoint(index)}
                                        className="p-2 rounded-full text-gray-500 hover:bg-red-600/20 hover:text-red-400 transition-colors opacity-50 group-hover:opacity-100"
                                        aria-label="Delete data point"
                                    >
                                        <Icon name="delete" className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddDataPoint}
                            className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-indigo-400 font-semibold"
                        >
                            <Icon name="add" className="w-5 h-5"/>
                            Add Data Point
                        </button>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-700 bg-gray-800/50 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-primary text-white font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-primary-hover"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PresentationEditorProps {
  presentation: Presentation;
  setPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
}

export const PresentationEditor: React.FC<PresentationEditorProps> = ({ presentation, setPresentation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [isInfographicEditorOpen, setIsInfographicEditorOpen] = useState(false);
  const [editingInfographic, setEditingInfographic] = useState<InfographicType | null>(null);

  if (!presentation) return null;

  const currentSlide = presentation.slides[currentSlideIndex];

  const updateSlide = (slideIndex: number, updatedProperties: Partial<Slide>) => {
    const newSlides = [...presentation.slides];
    newSlides[slideIndex] = { ...newSlides[slideIndex], ...updatedProperties };
    setPresentation({ ...presentation, slides: newSlides });
  };
  
  const updateContentItem = (slideIndex: number, contentIndex: number, newStyledText: StyledText) => {
    const newSlides = [...presentation.slides];
    if (newSlides[slideIndex].content) {
      const newContent = [...newSlides[slideIndex].content!];
      newContent[contentIndex] = newStyledText;
      newSlides[slideIndex] = { ...newSlides[slideIndex], content: newContent };
      setPresentation({ ...presentation, slides: newSlides });
    }
  }
  
  const addSlideContentItem = (slideIndex: number) => {
    const newSlides = [...presentation.slides];
    const newContentItem: StyledText = { 
        text: "New bullet point",
        fontSize: "text-2xl",
        fontFamily: "font-sans"
    };
    const currentContent = newSlides[slideIndex].content || [];
    const newContent = [...currentContent, newContentItem];
    newSlides[slideIndex] = { ...newSlides[slideIndex], content: newContent };
    setPresentation({ ...presentation, slides: newSlides });
  };

  const deleteSlideContentItem = (slideIndex: number, contentIndex: number) => {
    const newSlides = [...presentation.slides];
    if (newSlides[slideIndex].content) {
      const newContent = newSlides[slideIndex].content!.filter((_, index) => index !== contentIndex);
      newSlides[slideIndex] = { ...newSlides[slideIndex], content: newContent };
      setPresentation({ ...presentation, slides: newSlides });
    }
  };


  const addSlide = () => {
    const newSlide: Slide = {
        id: `${Date.now()}`,
        slideType: 'content',
        title: { text: "New Slide Title", fontSize: "text-5xl", fontFamily: "font-display" },
        content: [{ text: "Add your content here.", fontSize: "text-2xl", fontFamily: "font-sans" }],
        image_prompt: "abstract background",
        imageUrl: `https://picsum.photos/seed/${Date.now()}/1280/720`
    };
    const newSlides = [...presentation.slides, newSlide];
    setPresentation({ ...presentation, slides: newSlides });
    setCurrentSlideIndex(newSlides.length - 1);
  };
  
  const deleteSlide = (slideIndex: number) => {
    if(presentation.slides.length <= 1) {
        alert("Cannot delete the last slide.");
        return;
    }
    const newSlides = presentation.slides.filter((_, index) => index !== slideIndex);
    setPresentation({ ...presentation, slides: newSlides });
    setCurrentSlideIndex(Math.max(0, slideIndex - 1));
  };

  const handleReorderSlides = (dragIndex: number, dropIndex: number) => {
    if (!presentation) return;
    
    const currentSlideId = presentation.slides[currentSlideIndex].id;

    const newSlides = [...presentation.slides];
    const [draggedItem] = newSlides.splice(dragIndex, 1);
    newSlides.splice(dropIndex, 0, draggedItem);
    
    setPresentation({ ...presentation, slides: newSlides });
    
    const newCurrentIndex = newSlides.findIndex(slide => slide.id === currentSlideId);
    if (newCurrentIndex !== -1) {
      setCurrentSlideIndex(newCurrentIndex);
    }
  };
  
  const handleRegenerateImage = async () => {
    setIsRegeneratingImage(true);
    try {
        const newImageUrl = await generateImage(currentSlide.image_prompt);
        updateSlide(currentSlideIndex, { imageUrl: newImageUrl });
    } catch (error) {
        console.error("Failed to regenerate image:", error);
    } finally {
        setIsRegeneratingImage(false);
    }
  };

  const handleOpenInfographicEditor = () => {
    if (currentSlide.infographic) {
      setEditingInfographic(structuredClone(currentSlide.infographic));
      setIsInfographicEditorOpen(true);
    }
  };

  const handleSaveAndCloseInfographicEditor = () => {
    if (editingInfographic) {
      updateSlide(currentSlideIndex, { infographic: editingInfographic });
    }
    setIsInfographicEditorOpen(false);
    setEditingInfographic(null);
  };
  
  const handleInfographicChange = (newInfographic: InfographicType) => {
    setEditingInfographic(newInfographic);
  };


  return (
    <div className="flex h-[calc(100vh-81px)] w-full text-white animate-fade-in">
        <Sidebar 
            slides={presentation.slides} 
            currentSlideIndex={currentSlideIndex} 
            onSelectSlide={setCurrentSlideIndex}
            onAddSlide={addSlide}
            onReorderSlides={handleReorderSlides}
        />

        {isInfographicEditorOpen && editingInfographic && (
            <InfographicEditor
                infographic={editingInfographic}
                onInfographicChange={handleInfographicChange}
                onClose={handleSaveAndCloseInfographicEditor}
            />
        )}

        <main className="flex-grow p-8 bg-gray-950 flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-xl shadow-2xl overflow-hidden relative flex flex-col justify-center items-center group/slide">
                {isRegeneratingImage && (
                    <div className="absolute inset-0 bg-black/70 z-40 flex flex-col items-center justify-center animate-fade-in">
                         <svg className="w-12 h-12 animate-spin text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0-0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-lg text-gray-300">Conjuring a new visual...</p>
                    </div>
                )}
                <img key={`${currentSlide.id}-image`} src={currentSlide.imageUrl} alt={currentSlide.image_prompt} className={`absolute inset-0 w-full h-full object-cover z-0 animate-fade-in transition-all duration-500 ${isRegeneratingImage ? 'blur-sm' : 'blur-0'}`} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10"></div>
                
                <div key={currentSlide.id} className="relative z-20 w-full h-full p-12 md:p-16 lg:p-20 flex flex-col justify-center animate-fade-in">
                    <EditableText
                        initialValue={currentSlide.title}
                        onSave={(newValue) => updateSlide(currentSlideIndex, { title: newValue })}
                        className="font-bold tracking-tighter mb-6 text-white text-shadow-md text-center"
                        as="input"
                        sizeOptions={['text-4xl', 'text-5xl', 'text-6xl']}
                        fontOptions={[{class: 'font-display', label: 'Display'}, {class: 'font-sans', label: 'Sans'}]}
                    />

                    {currentSlide.slideType === 'infographic' && currentSlide.infographic && (
                        <div className="flex-grow flex items-center justify-center">
                            <Infographic infographic={currentSlide.infographic} />
                        </div>
                    )}
                    
                    {currentSlide.slideType === 'content' && (
                        <>
                            <ul className="space-y-4">
                                {currentSlide.content?.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 group">
                                        <span className="text-primary text-2xl mt-1 flex-shrink-0">&#8226;</span>
                                        <div className="flex-grow">
                                        <EditableText
                                            initialValue={item}
                                            onSave={(newValue) => updateContentItem(currentSlideIndex, index, newValue)}
                                            className="text-gray-200 text-shadow"
                                            as="textarea"
                                            sizeOptions={['text-xl', 'text-2xl', 'text-3xl']}
                                            fontOptions={[{class: 'font-sans', label: 'Sans'}, {class: 'font-display', label: 'Display'}]}
                                        />
                                        </div>
                                        <button 
                                            onClick={() => deleteSlideContentItem(currentSlideIndex, index)}
                                            className="ml-2 mt-1 p-1 rounded-full text-gray-500 hover:bg-red-600/20 hover:text-red-400 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all focus:opacity-100 focus:scale-100"
                                            aria-label="Delete item"
                                        >
                                            <Icon name="delete" className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <button
                                    onClick={() => addSlideContentItem(currentSlideIndex)}
                                    className="flex items-center justify-center gap-2 bg-white/5 text-gray-400 font-medium py-2 px-4 rounded-lg transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <Icon name="add" className="w-5 h-5"/>
                                    Add Bullet Point
                                </button>
                            </div>
                        </>
                    )}


                    <div className="mt-auto pt-5 border-t border-white/10 flex items-center gap-4">
                        <p className="text-sm font-semibold text-gray-400 flex-shrink-0">Image Prompt:</p>
                        <div className="flex-grow">
                             <EditableText
                                initialValue={{text: currentSlide.image_prompt, fontSize: 'text-sm', fontFamily: 'font-sans'}}
                                onSave={(newValue) => updateSlide(currentSlideIndex, { image_prompt: newValue.text })}
                                className="text-gray-300 w-full italic bg-transparent p-1 -m-1 rounded-md hover:bg-white/10 focus:bg-white/10 transition-colors"
                                as="input"
                                sizeOptions={['text-xs', 'text-sm', 'text-base']}
                                fontOptions={[{class: 'font-sans', label: 'Sans'}, {class: 'font-display', label: 'Display'}]}
                            />
                        </div>
                        <button 
                          onClick={handleRegenerateImage}
                          disabled={isRegeneratingImage}
                          className="p-2 bg-primary rounded-full text-white hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-950 flex-shrink-0 disabled:bg-gray-600 disabled:cursor-wait"
                          title="Regenerate Image"
                        >
                            <Icon name="regenerate" className={`w-5 h-5 ${isRegeneratingImage ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                </div>
                 <button 
                    onClick={() => deleteSlide(currentSlideIndex)}
                    className="absolute top-4 right-4 z-30 p-2 bg-black/50 rounded-full text-gray-300 hover:bg-red-600/80 hover:text-white transition-all">
                    <Icon name="delete" className="w-6 h-6" />
                </button>
                {currentSlide.slideType === 'infographic' && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={handleOpenInfographicEditor}
                            className="flex items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-lg transition-all hover:bg-primary-hover transform hover:scale-105 shadow-lg shadow-primary/30"
                        >
                            <Icon name="edit" className="w-5 h-5"/>
                            Edit Infographic
                        </button>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};