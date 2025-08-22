"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MoreHorizontal,
  Target,
  Bug,
  Sparkles,
  FileText,
  Zap,
  Edit,
  Trash2,
  BadgeCheck,
} from "lucide-react";
import { Task } from "@/store/slices/kanbanSlice";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close options dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const handleVerificationToggle = () => {
    setIsVerified(!isVerified);
    setShowTooltip(false);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Bug":
        return <Bug className="h-3 w-3" />;
      case "Feature":
        return <Sparkles className="h-3 w-3" />;
      case "Enhancement":
        return <Zap className="h-3 w-3" />;
      case "Documentation":
        return <FileText className="h-3 w-3" />;
      default:
        return <Target className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bug":
        return "bg-red-50 text-red-700 border-red-200";
      case "Feature":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Enhancement":
        return "bg-green-50 text-green-700 border-green-200";
      case "Documentation":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number, type: string) => {
    // Base color depends on task type
    const baseColors = {
      Bug: { bg: "#fef2f2", border: "#fecaca", fill: "#ef4444" },
      Feature: { bg: "#eff6ff", border: "#bfdbfe", fill: "#3b82f6" },
      Enhancement: { bg: "#f0fdf4", border: "#bbf7d0", fill: "#22c55e" },
      Documentation: { bg: "#faf5ff", border: "#e9d5ff", fill: "#a855f7" },
      default: { bg: "#f9fafb", border: "#d1d5db", fill: "#6b7280" },
    };

    return baseColors[type as keyof typeof baseColors] || baseColors.default;
  };

  const CircularProgress = ({
    score,
    type,
  }: {
    score: number;
    type: string;
  }) => {
    const colors = getScoreColor(score, type);
    const percentage = (score / 10) * 100;
    const strokeDasharray = 2 * Math.PI * 8; // circumference for r=8
    const strokeDashoffset =
      strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
      <div className="relative w-3 h-3 flex items-center justify-center">
        {/* Background circle with spokes */}
        <svg className="w-3 h-3 transform -rotate-90" viewBox="0 0 20 20">
          {/* Spoke lines */}
          {[...Array(8)].map((_, i) => {
            const angle = i * 45 * (Math.PI / 180);
            const x1 = 10 + Math.cos(angle) * 6;
            const y1 = 10 + Math.sin(angle) * 6;
            const x2 = 10 + Math.cos(angle) * 8;
            const y2 = 10 + Math.sin(angle) * 8;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={colors.border}
                strokeWidth="1.3"
                opacity="1"
              />
            );
          })}

          {/* Background circle */}
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke={colors.border}
            strokeWidth="1.3"
            opacity="0.2"
          />

          {/* Progress circle */}
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke={colors.fill}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 1px ${colors.fill}30)`,
            }}
          />
        </svg>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-xs text-gray-500">#{task.id}</span>
          <span className="text-xs text-gray-400 hidden sm:inline">
            {formatDate(task.date)}
          </span>
        </div>
        <div className="relative" ref={optionsRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
          </button>

          {/* Options Dropdown */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-28 sm:w-32"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(false);
                    onDelete(task.id);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3 leading-tight">
        {task.title}
      </h3>

      {/* Date on mobile */}
      <div className="sm:hidden mb-2">
        <span className="text-xs text-gray-400">{formatDate(task.date)}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap gap-1">
          <span
            className={`inline-flex items-center px-1.5 sm:px-1 rounded-md text-xs font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          <span
            className={`inline-flex items-center space-x-1 px-1.5 sm:px-1 rounded-md text-xs font-medium border ${getTypeColor(
              task.type
            )}`}
          >
            {getTypeIcon(task.type)}
            <span className="hidden sm:inline">{task.type}</span>
            <span className="sm:hidden">{task.type.substring(0, 3)}</span>
          </span>
          <span className="flex items-center space-x-1 justify-center">
            <CircularProgress score={task.score} type={task.type} />
            <span className="text-sm font-semibold text-gray-700">
              {task.score}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Verification Badge */}
              <div className="relative" ref={tooltipRef}>
                <button
                  onClick={handleVerificationToggle}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="focus:outline-none hover:scale-110 transition-transform duration-200"
                >
                  <BadgeCheck
                    size={14}
                    className={`sm:w-4 sm:h-4 ${
                      isVerified
                        ? "text-blue-500 fill-blue-100"
                        : "text-gray-400 hover:text-gray-600"
                    } transition-colors duration-200`}
                  />
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute -top-8 -left-20 transform -translate-x-1/2 z-[9999]"
                    >
                      <div className="bg-blue-900 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-xl flex items-center space-x-2">
                        <span>
                          {isVerified ? "Verified by Sam" : "Click to verify"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
