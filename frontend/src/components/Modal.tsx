import React from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          {title}
        </h2>
        <div className="text-gray-700">{children}</div>
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
