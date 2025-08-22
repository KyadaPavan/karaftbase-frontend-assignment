"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Target, Tag } from "lucide-react";
import { Task } from "@/store/slices/kanbanSlice";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  task?: Task;
  columnId?: string;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
  columnId,
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium" as Task["priority"],
    type: "Feature" as Task["type"],
    score: 0,
    date: new Date().toISOString().split("T")[0],
    labels: [] as string[],
    assignee: "",
  });

  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        type: task.type,
        score: task.score,
        date: task.date,
        labels: task.labels,
        assignee: task.assignee || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        type: "Feature",
        score: 0,
        date: new Date().toISOString().split("T")[0],
        labels: [],
        assignee: "",
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData({
        ...formData,
        labels: [...formData.labels, newLabel.trim()],
      });
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((label) => label !== labelToRemove),
    });
  };

  const priorities: Task["priority"][] = ["Low", "Medium", "High", "Critical"];
  const types: Task["type"][] = [
    "Bug",
    "Feature",
    "Enhancement",
    "Documentation",
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
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {task ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Enter task title"
                  required
                />
              </div>

              {/* Priority and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Task["priority"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    {priorities.map((priority) => (
                      <option
                        key={priority}
                        value={priority}
                        className="text-gray-900"
                      >
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as Task["type"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    {types.map((type) => (
                      <option key={type} value={type} className="text-gray-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Score and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="inline h-4 w-4 mr-1" />
                    Score
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.score}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        score: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 ">
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
                  {task ? "Update Task" : "Create Task"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
