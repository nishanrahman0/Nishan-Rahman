import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, rows = 8 }) => {
  const toolbarButtons = ['B', 'I', 'U', 'S'];

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
      <div className="flex items-center space-x-2 border-b border-gray-200 p-2 bg-white rounded-t-lg">
        <span className="text-sm text-gray-500 pr-2 border-r border-gray-200">Normal</span>
        {toolbarButtons.map((btn) => (
          <button
            key={btn}
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            disabled
          >
            {btn}
          </button>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-3 text-gray-800 placeholder-gray-400 focus:outline-none resize-y bg-transparent"
      />
    </div>
  );
};

export default RichTextEditor;