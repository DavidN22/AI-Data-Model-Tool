import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(onClose, 300); // Wait for animation to finish before unmounting
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            key="modal-content"
            className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
              {title}
            </h2>
            <div className="text-gray-700">{children}</div>
            <div className="flex justify-end mt-8">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
