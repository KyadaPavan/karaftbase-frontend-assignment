"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { Column } from "@/store/slices/kanbanSlice";

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: Omit<Column, "id" | "tasks">) => void;
  onDelete?: (columnId: string) => void;
  column?: Column;
}

export default function ColumnModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  column,
}: ColumnModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    color: "gray" as const,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (column) {
      setFormData({
        title: column.title,
        color: column.color as any,
      });
    } else {
      setFormData({
        title: "",
        color: "gray",
      });
    }
    setShowDeleteConfirm(false);
  }, [column, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (column && onDelete) {
      onDelete(column.id);
      onClose();
    }
  };

  const colors = [
    { name: "Gray", value: "gray", class: "bg-gray-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {column ? "Edit Column" : "Create New Column"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {!showDeleteConfirm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Column Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="Enter column title"
                    required
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            color: color.value as any,
                          })
                        }
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.color === color.value
                            ? "border-gray-900"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full ${color.class} mx-auto`}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1 block">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <div>
                    {column && onDelete && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {column ? "Update Column" : "Create Column"}
                    </motion.button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete Column
                  </h3>
                  <p className="text-gray-600">
                    Are you sure you want to delete "{column?.title}"? This
                    action cannot be undone and will delete all tasks in this
                    column.
                  </p>
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Column
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
