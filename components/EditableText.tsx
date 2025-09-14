
import React, { useState, useEffect, useRef } from 'react';
import type { StyledText } from '../types';

interface ToolbarProps {
  currentStyle: StyledText;
  onStyleChange: (newStyle: Partial<StyledText>) => void;
  sizeOptions: string[];
  fontOptions: { class: string, label: string }[];
}

const EditingToolbar: React.FC<ToolbarProps> = ({ currentStyle, onStyleChange, sizeOptions, fontOptions }) => {
    const getSizeLabel = (sizeClass: string) => {
        const parts = sizeClass.split('-');
        const size = parts[parts.length - 1];
        if (size.includes('xl')) return size.replace('xl', 'XL');
        return size.toUpperCase();
    }

    return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 rounded-lg shadow-lg p-1 flex items-center gap-1 z-30 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center bg-gray-700 rounded">
            {sizeOptions.map(size => (
                <button
                    key={size}
                    onClick={() => onStyleChange({ fontSize: size })}
                    className={`px-2 py-1 text-xs font-bold rounded transition-colors ${currentStyle.fontSize === size ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    title={`Font size: ${size}`}
                >
                   {getSizeLabel(size)}
                </button>
            ))}
        </div>
        <div className="w-px h-6 bg-gray-600 mx-1"></div>
        <div className="flex items-center bg-gray-700 rounded">
            {fontOptions.map(font => (
                <button
                    key={font.class}
                    onClick={() => onStyleChange({ fontFamily: font.class })}
                    className={`px-3 py-1 text-sm rounded transition-colors ${font.class} ${currentStyle.fontFamily === font.class ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                    {font.label}
                </button>
            ))}
        </div>
    </div>
);
}


interface EditableTextProps {
  initialValue: StyledText;
  onSave: (value: StyledText) => void;
  className?: string;
  as?: 'input' | 'textarea';
  sizeOptions: string[];
  fontOptions: { class: string, label: string }[];
}

export const EditableText: React.FC<EditableTextProps> = ({ initialValue, onSave, className, as = 'input', sizeOptions, fontOptions }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
        onSave({ ...value, text: value.text.trim() });
    }
     setIsEditing(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && as === 'input' && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSave();
    }
    if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if(isEditing) {
            handleSave();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, value, initialValue]);


  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: value.text,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(prev => ({ ...prev, text: e.target.value })),
      onKeyDown: handleKeyDown,
      className: `bg-transparent border-2 border-primary rounded-md p-0 m-0 w-full focus:outline-none ${value.fontFamily} ${value.fontSize} ${className}`,
    };
    return (
        <div className="relative" ref={wrapperRef}>
            {as === 'textarea' ? 
                <textarea {...commonProps} rows={3} /> :
                <input type="text" {...commonProps} />
            }
            <EditingToolbar
                currentStyle={value}
                onStyleChange={(newStyle) => setValue(prev => ({ ...prev, ...newStyle }))}
                sizeOptions={sizeOptions}
                fontOptions={fontOptions}
            />
        </div>
    );
  }
  
  return (
    <div onClick={() => setIsEditing(true)} className={`cursor-pointer w-full p-0 m-0 ${initialValue.fontFamily} ${initialValue.fontSize} ${className}`}>
      {initialValue.text || "Click to edit"}
    </div>
  );
};