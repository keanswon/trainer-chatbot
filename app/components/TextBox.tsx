import React from 'react';

interface TextBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "Type a message…",
  rows = 3,
  disabled = false,
  className = "",
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      onKeyDown={ onKeyDown }
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`
        w-full px-4 py-3 
        border border-gray-200 rounded-lg 
        bg-white
        text-gray-900 placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        resize-none
        transition-all duration-200
        shadow-sm hover:shadow-md focus:shadow-md
        text-sm leading-relaxed
        ${className}
      `}
    />
  );
};

export default TextBox;