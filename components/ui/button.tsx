import React from 'react';

export function Button({ children, ...props }) {
  return (
    <button
      className="bg-white text-primary-dark px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
      {...props}
    >
      {children}
    </button>
  );
}
