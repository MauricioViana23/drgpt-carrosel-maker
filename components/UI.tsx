import React from 'react';

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold ml-1">
    {children}
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full bg-[#151515] text-gray-200 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all placeholder-gray-600 ${props.className}`}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full bg-[#151515] text-gray-200 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all placeholder-gray-600 resize-none ${props.className}`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full appearance-none bg-[#151515] text-gray-200 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all ${props.className}`}
    >
      {props.children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#0F0F0F] border border-white/5 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);
