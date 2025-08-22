"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Plus, MoreHorizontal } from "lucide-react";
import { Column as ColumnType, Task } from "@/store/slices/kanbanSlice";
import { useAppSelector } from "@/store/hooks";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (columnId: string) => void;
}

export default function Column({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const { searchTerm, filterLabel, sortBy } = useAppSelector(
    (state) =>
      state.kanban as {
        searchTerm: string;
        filterLabel: string;
        sortBy: string;
      }
  );

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = column.tasks;

    // Filter by search term
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.labels.some((label) =>
            label.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by label
    if (filterLabel) {
      filteredTasks = filteredTasks.filter(
        (task) => task.labels.includes(filterLabel) || task.type === filterLabel
      );
    }

    // Sort tasks
    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "priority":
          const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return (
            (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          );
        case "score":
          return b.score - a.score;
        default:
          return 0;
      }
    });
  }, [column.tasks, searchTerm, filterLabel, sortBy]);

  const getColumnColor = (color: string) => {
    switch (color) {
      case "gray":
        return "border-gray-300";
      case "orange":
        return "border-orange-300";
      case "blue":
        return "border-blue-300";
      case "green":
        return "border-green-300";
      case "purple":
        return "border-purple-300";
      default:
        return "border-gray-300";
    }
  };

  const getColumnIndicator = (color: string) => {
    switch (color) {
      case "gray":
        return "bg-gray-500";
      case "orange":
        return "bg-orange-500";
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "purple":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const taskIds = filteredAndSortedTasks.map((task) => task.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${getColumnIndicator(
              column.color
            )}`}
          ></div>
          <h2 className="font-semibold text-gray-900">{column.title}</h2>
          <span className=" text-gray-700 ">
            {filteredAndSortedTasks.length}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddTask(column.id)}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditColumn(column)}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className="space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {filteredAndSortedTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tasks found</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddTask(column.id)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Add a task
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
