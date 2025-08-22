"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  moveTask,
  addTask,
  editTask,
  deleteTask,
  addColumn,
  editColumn,
  deleteColumn,
  Task,
  Column as ColumnType,
} from "@/store/slices/kanbanSlice";
import Header from "./Header";
import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import ColumnModal from "./ColumnModal";
import type { RootState } from "@/store/store";

export default function KanbanBoard() {
  const dispatch = useAppDispatch();

  const { columns } = useAppSelector(
    (state: RootState) => state.kanban as { columns: ColumnType[] }
  );

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<
    ColumnType | undefined
  >();
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    const task = findTaskById(active.id.toString());
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const task = findTaskById(activeId);
    if (!task) return;

    // Find source and destination columns
    const sourceColumn = findColumnByTaskId(activeId);
    const destinationColumn =
      findColumnById(overId) || findColumnByTaskId(overId);

    if (!sourceColumn || !destinationColumn) return;

    // If dropping on the same column, don't do anything for now
    if (sourceColumn.id === destinationColumn.id) return;

    // Move task to new column
    const destinationIndex = destinationColumn.tasks.length;

    dispatch(
      moveTask({
        taskId: activeId,
        sourceColumnId: sourceColumn.id,
        destinationColumnId: destinationColumn.id,
        destinationIndex,
      })
    );
  };

  const findTaskById = (id: string): Task | undefined => {
    for (const column of columns) {
      const task = column.tasks.find((task: Task) => task.id === id);
      if (task) return task;
    }
    return undefined;
  };

  const findColumnById = (id: string): ColumnType | undefined => {
    return columns.find((column: ColumnType) => column.id === id);
  };

  const findColumnByTaskId = (taskId: string): ColumnType | undefined => {
    return columns.find((column: ColumnType) =>
      column.tasks.some((task: Task) => task.id === taskId)
    );
  };

  const handleAddTask = (columnId?: string) => {
    setSelectedTask(undefined);
    setSelectedColumnId(columnId || "");
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setSelectedColumnId("");
    setTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = findTaskById(taskId);
    if (task) {
      setTaskToDelete(task);
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete.id));
      setTaskToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleSaveTask = (taskData: Omit<Task, "id">) => {
    if (selectedTask) {
      // Edit existing task
      dispatch(editTask({ ...taskData, id: selectedTask.id }));
    } else {
      // Add new task
      const targetColumnId = selectedColumnId || columns[0]?.id;
      if (targetColumnId) {
        dispatch(addTask({ columnId: targetColumnId, task: taskData }));
      }
    }
  };

  const handleAddColumn = () => {
    setSelectedColumn(undefined);
    setColumnModalOpen(true);
  };

  const handleEditColumn = (column: ColumnType) => {
    setSelectedColumn(column);
    setColumnModalOpen(true);
  };

  const handleDeleteColumn = (columnId: string) => {
    dispatch(deleteColumn(columnId));
  };

  const handleSaveColumn = (columnData: Omit<ColumnType, "id" | "tasks">) => {
    if (selectedColumn) {
      // Edit existing column
      dispatch(editColumn({ ...selectedColumn, ...columnData }));
    } else {
      // Add new column
      dispatch(addColumn(columnData));
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header onAddTask={handleAddTask} onAddColumn={handleAddColumn} />

      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full overflow-x-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex md:space-x-6 space-x-3 p-3 md:p-6 min-w-max h-full"
            >
              {columns.map((column: ColumnType) => (
                <Column
                  key={column.id}
                  column={column}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onEditColumn={handleEditColumn}
                />
              ))}
            </motion.div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-5 transform">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        columnId={selectedColumnId}
      />

      <ColumnModal
        isOpen={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        onSave={handleSaveColumn}
        onDelete={handleDeleteColumn}
        column={selectedColumn}
      />

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirmOpen && taskToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={cancelDeleteTask}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md mx-auto shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Delete Task
                </h3>
                <button
                  onClick={cancelDeleteTask}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Are you sure you want to delete &quot;
                  <strong className="text-gray-900">
                    {taskToDelete.title}
                  </strong>
                  &quot;?
                </p>
                <p className="text-red-600 text-sm mt-2 font-medium">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={cancelDeleteTask}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDeleteTask}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg order-1 sm:order-2"
                >
                  Delete Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
