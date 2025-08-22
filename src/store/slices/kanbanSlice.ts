import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  type: "Bug" | "Feature" | "Enhancement" | "Documentation";
  score: number;
  date: string;
  labels: string[];
  assignee?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface KanbanState {
  columns: Column[];
  searchTerm: string;
  filterLabel: string;
  sortBy: "date" | "priority" | "score";
}

const initialColumns: Column[] = [
  {
    id: "draft",
    title: "Draft",
    color: "gray",
    tasks: [
      {
        id: "1",
        title: "PI Disclosure",
        priority: "Medium",
        type: "Enhancement",
        score: 4.5,
        date: "2024-01-15",
        labels: ["Enhancement"],
      },
      {
        id: "2",
        title: "Server Side Template Injection (Blind)",
        priority: "Critical",
        type: "Bug",
        score: 8.8,
        date: "2024-01-15",
        labels: ["Bug"],
      },
    ],
  },
  {
    id: "unsolved",
    title: "Unsolved",
    color: "orange",
    tasks: [
      {
        id: "3",
        title: ".svn/entries Found",
        priority: "Low",
        type: "Feature",
        score: 2.3,
        date: "2024-01-13",
        labels: ["Feature"],
      },
    ],
  },
  {
    id: "under-review",
    title: "Under Review",
    color: "blue",
    tasks: [
      {
        id: "4",
        title: "WordPress Database Backup File Found",
        priority: "Medium",
        type: "Enhancement",
        score: 6.5,
        date: "2024-01-11",
        labels: ["Enhancement"],
      },
      {
        id: "5",
        title: "JSON Web Key Set Disclosed",
        priority: "High",
        type: "Documentation",
        score: 6.5,
        date: "2024-01-12",
        labels: ["Documentation"],
      },
    ],
  },
  {
    id: "solved",
    title: "Solved",
    color: "green",
    tasks: [
      {
        id: "6",
        title: ".svn/entries Found",
        priority: "Medium",
        type: "Feature",
        score: 6.5,
        date: "2024-01-08",
        labels: ["Feature"],
      },
      {
        id: "7",
        title: "PI Disclosure",
        priority: "Medium",
        type: "Documentation",
        score: 6.5,
        date: "2024-01-09",
        labels: ["Documentation"],
      },
      {
        id: "8",
        title: "Phonypanel Information Schema Disclosed",
        priority: "Critical",
        type: "Bug",
        score: 6.5,
        date: "2024-01-10",
        labels: ["Bug"],
      },
      {
        id: "9",
        title: "JSON Web Key Set Disclosed",
        priority: "High",
        type: "Documentation",
        score: 6.5,
        date: "2024-01-12",
        labels: ["Documentation"],
      },
    ],
  },
  {
    id: "needs-info",
    title: "Needs Info",
    color: "purple",
    tasks: [
      {
        id: "10",
        title: "JSON Web Key Set Disclosed",
        priority: "Low",
        type: "Feature",
        score: 6.5,
        date: "2024-01-14",
        labels: ["Feature"],
      },
    ],
  },
];

const initialState: KanbanState = {
  columns: initialColumns,
  searchTerm: "",
  filterLabel: "",
  sortBy: "date",
};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        sourceColumnId: string;
        destinationColumnId: string;
        destinationIndex: number;
      }>
    ) => {
      const { taskId, sourceColumnId, destinationColumnId, destinationIndex } =
        action.payload;

      const sourceColumn = state.columns.find(
        (col) => col.id === sourceColumnId
      );
      const destinationColumn = state.columns.find(
        (col) => col.id === destinationColumnId
      );

      if (sourceColumn && destinationColumn) {
        const taskIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === taskId
        );
        if (taskIndex !== -1) {
          const [task] = sourceColumn.tasks.splice(taskIndex, 1);
          destinationColumn.tasks.splice(destinationIndex, 0, task);
        }
      }
    },
    addTask: (
      state,
      action: PayloadAction<{
        columnId: string;
        task: Omit<Task, "id">;
      }>
    ) => {
      const { columnId, task } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
        };
        column.tasks.push(newTask);
      }
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;
      for (const column of state.columns) {
        const taskIndex = column.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (taskIndex !== -1) {
          column.tasks[taskIndex] = updatedTask;
          break;
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      for (const column of state.columns) {
        const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          column.tasks.splice(taskIndex, 1);
          break;
        }
      }
    },
    addColumn: (state, action: PayloadAction<Omit<Column, "id" | "tasks">>) => {
      const newColumn: Column = {
        ...action.payload,
        id: Date.now().toString(),
        tasks: [],
      };
      state.columns.push(newColumn);
    },
    editColumn: (state, action: PayloadAction<Column>) => {
      const updatedColumn = action.payload;
      const columnIndex = state.columns.findIndex(
        (col) => col.id === updatedColumn.id
      );
      if (columnIndex !== -1) {
        state.columns[columnIndex] = updatedColumn;
      }
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      state.columns = state.columns.filter((col) => col.id !== columnId);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterLabel: (state, action: PayloadAction<string>) => {
      state.filterLabel = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"date" | "priority" | "score">
    ) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  moveTask,
  addTask,
  editTask,
  deleteTask,
  addColumn,
  editColumn,
  deleteColumn,
  setSearchTerm,
  setFilterLabel,
  setSortBy,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
