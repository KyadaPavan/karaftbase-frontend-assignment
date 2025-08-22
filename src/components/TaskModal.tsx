"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Target, AlertCircle } from "lucide-react";
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
  const [errors, setErrors] = useState({
    title: "",
    score: "",
  });

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
    // Clear errors when modal opens/closes
    setErrors({ title: "", score: "" });
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors = { title: "", score: "" };

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    // Validate score
    if (formData.score < 0) {
      newErrors.score = "Score cannot be less than 0";
    } else if (formData.score > 10) {
      newErrors.score = "Score cannot be more than 10";
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, title: value });

    // Real-time validation for title
    if (!value.trim()) {
      setErrors({ ...errors, title: "Task title is required" });
    } else if (value.trim().length < 3) {
      setErrors({
        ...errors,
        title: "Title must be at least 3 characters long",
      });
    } else {
      setErrors({ ...errors, title: "" });
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const clampedValue = Math.min(Math.max(value, 0), 10);

    setFormData({ ...formData, score: clampedValue });

    // Real-time validation for score
    if (clampedValue < 0) {
      setErrors({ ...errors, score: "Score cannot be less than 0" });
    } else if (clampedValue > 10) {
      setErrors({ ...errors, score: "Score cannot be more than 10" });
    } else {
      setErrors({ ...errors, score: "" });
    }
  };

  // const addLabel = () => {
  //   if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
  //     setFormData({
  //       ...formData,
  //       labels: [...formData.labels, newLabel.trim()],
  //     });
  //     setNewLabel("");
  //   }
  // };

  // const removeLabel = (labelToRemove: string) => {
  //   setFormData({
  //     ...formData,
  //     labels: formData.labels.filter((label) => label !== labelToRemove),
  //   });
  // };

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
                  onChange={handleTitleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-colors ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-gray-500"
                  }`}
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </div>
                )}
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
                    onChange={handleScoreChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-colors ${
                      errors.score
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-gray-500"
                    }`}
                    placeholder="0.0 - 10.0"
                  />
                  {errors.score && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.score}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Score must be between 0 and 10
                  </p>
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
                  whileHover={{
                    scale: errors.title || errors.score ? 1 : 1.02,
                  }}
                  whileTap={{ scale: errors.title || errors.score ? 1 : 0.98 }}
                  type="submit"
                  disabled={
                    !formData.title.trim() || !!errors.title || !!errors.score
                  }
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !formData.title.trim() || !!errors.title || !!errors.score
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
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
