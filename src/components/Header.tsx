"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SortAsc, Plus, LogOut, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import {
  setSearchTerm,
  setFilterLabel,
  setSortBy,
} from "@/store/slices/kanbanSlice";

interface HeaderProps {
  onAddTask: () => void;
  onAddColumn: () => void;
}

export default function Header({ onAddTask, onAddColumn }: HeaderProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { searchTerm, filterLabel, sortBy } = useAppSelector(
    (state: any) => state.kanban
  );
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const labels = ["Bug", "Feature", "Enhancement", "Documentation"];
  const sortOptions = [
    { value: "date", label: "Date", shortLabel: "Date" },
    { value: "priority", label: "Priority", shortLabel: "Priority" },
    { value: "score", label: "Score", shortLabel: "Score" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            <span>Vulnerabilities</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full sm:w-64 lg:w-80 text-sm text-gray-900 placeholder-gray-500 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 border rounded-lg transition-colors text-xs sm:text-sm text-gray-700 ${
                showFilters
                  ? "bg-gray-100 border-gray-400"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>

            {/* Sort */}
            {/* Sort - Mobile */}
            <select
              value={sortBy}
              onChange={(e) =>
                dispatch(
                  setSortBy(e.target.value as "date" | "priority" | "score")
                )
              }
              className="sm:hidden border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs text-gray-900 bg-white"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-900"
                >
                  {option.shortLabel}
                </option>
              ))}
            </select>

            {/* Sort - Desktop */}
            <select
              value={sortBy}
              onChange={(e) =>
                dispatch(
                  setSortBy(e.target.value as "date" | "priority" | "score")
                )
              }
              className="hidden sm:block border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm text-gray-900 bg-white"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-900"
                >
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddTask}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Task</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddColumn}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm text-gray-700"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add Column</span>
            <span className="sm:hidden">Col</span>
          </motion.button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Filter by label:
            </span>
            <button
              onClick={() => dispatch(setFilterLabel(""))}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filterLabel === ""
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
            >
              All
            </button>
            {labels.map((label) => (
              <button
                key={label}
                onClick={() => dispatch(setFilterLabel(label))}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterLabel === label
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
