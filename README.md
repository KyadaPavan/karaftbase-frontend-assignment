# Kraftbase - Security Vulnerability Kanban Board

A professional, responsive Kanban board application for managing security vulnerabilities, built with Next.js, TypeScript, and Redux Toolkit.

## 🚀 Features

### Authentication

- **Secure Login System**: Email and password authentication with validation
- **State Management**: User session managed with Redux
- **Route Protection**: Private routes accessible only to authenticated users
- **Demo Credentials**:
  - Email: `pavan@gmail.com`
  - Password: `Pavan@16`

### Task Management

- **CRUD Operations**: Create, read, update, and delete tasks
- **Drag & Drop**: Intuitive drag-and-drop interface using @dnd-kit
- **Task Properties**: Priority, type, score, labels, assignee, and due dates
- **Rich Task Cards**: Color-coded priority and type indicators

### Category Management

- **Dynamic Columns**: Add, edit, and delete categories
- **Color Coding**: Visual distinction with customizable colors
- **Task Counters**: Real-time task count per column

### Search & Filter

- **Global Search**: Search tasks by name or labels
- **Label Filtering**: Filter tasks by specific labels or types
- **Multiple Sort Options**: Sort by date, priority, or score
- **Real-time Updates**: Instant filtering and sorting

### User Interface

- **Responsive Design**: Optimized for all screen sizes
- **Professional Styling**: Clean white and gray color scheme
- **Smooth Animations**: Powered by Framer Motion
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠 Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Next.js built-in bundler

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kraftbase
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3001
   ```

## 🔧 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Column.tsx         # Kanban column component
│   ├── ColumnModal.tsx    # Column create/edit modal
│   ├── Header.tsx         # Application header
│   ├── KanbanBoard.tsx    # Main board component
│   ├── LoginForm.tsx      # Authentication form
│   ├── TaskCard.tsx       # Individual task card
│   └── TaskModal.tsx      # Task create/edit modal
└── store/                 # Redux store
    ├── hooks.ts           # Typed Redux hooks
    ├── store.ts           # Store configuration
    └── slices/            # Redux slices
        ├── authSlice.ts   # Authentication state
        └── kanbanSlice.ts # Kanban board state
```

## 🎨 Design Features

### Color Scheme

- **Primary**: Clean whites and grays
- **Accents**: Color-coded priority levels
- **Status**: Green for success, red for critical, orange for warnings

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Animation Guidelines

- **Hover Effects**: Subtle scale and color transitions
- **Page Transitions**: Smooth enter/exit animations
- **Drag Feedback**: Visual feedback during drag operations

## 🔐 Authentication Flow

1. **Initial State**: User lands on login page
2. **Validation**: Client-side email and password validation
3. **Authentication**: Redux action validates credentials
4. **Success**: User redirected to Kanban board
5. **Session**: State persisted during browser session
6. **Logout**: Clears state and redirects to login

## 🎯 Task Management Features

### Task Properties

- **ID**: Unique identifier
- **Title**: Task name (required)
- **Description**: Optional detailed description
- **Priority**: Low, Medium, High, Critical
- **Type**: Bug, Feature, Enhancement, Documentation
- **Score**: Numerical score (0-10)
- **Date**: Creation/due date
- **Labels**: Searchable tags
- **Assignee**: Optional team member

### Column Configuration

- **Title**: Column name
- **Color**: Visual identifier (Gray, Orange, Blue, Green, Purple)
- **Tasks**: Array of associated tasks

## 🔍 Search & Filter System

### Search Functionality

- **Real-time**: Instant results as you type
- **Multi-field**: Searches titles and labels
- **Case-insensitive**: Flexible matching

### Filter Options

- **By Label**: Filter by task labels or types
- **By Status**: Column-based filtering
- **Clear Filters**: Reset to show all tasks

### Sort Options

- **By Date**: Newest first (default)
- **By Priority**: Critical → High → Medium → Low
- **By Score**: Highest to lowest

## 🎭 State Management Architecture

### Auth Slice

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
```

### Kanban Slice

```typescript
interface KanbanState {
  columns: Column[];
  searchTerm: string;
  filterLabel: string;
  sortBy: "date" | "priority" | "score";
}
```

## 🚀 Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting
- **Tree Shaking**: Unused code elimination
- **Memoization**: React.memo for expensive components
- **Optimized Rendering**: Selective re-renders with Redux selectors

## 📱 Responsive Design

### Mobile (< 640px)

- Single column layout
- Collapsible filters
- Touch-optimized interactions
- Simplified navigation

### Tablet (640px - 1024px)

- Two-column layout
- Condensed header
- Swipe gestures for navigation

### Desktop (> 1024px)

- Full multi-column layout
- Complete feature set
- Keyboard shortcuts
- Hover interactions

## 🧪 Testing Credentials

For testing the application, use these credentials:

- **Email**: `pavan@gmail.com`
- **Password**: `Pavan@16`

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📋 Features Checklist

✅ **User Authentication**

- Login/logout functionality
- Form validation
- Route protection

✅ **Task Management**

- Create, edit, delete tasks
- Drag and drop between columns
- Rich task properties

✅ **Search & Filter**

- Real-time search
- Label-based filtering
- Multiple sort options

✅ **State Management**

- Redux Toolkit implementation
- Proper action/reducer patterns
- Optimized selectors

✅ **Responsive Design**

- Mobile-first approach
- All screen sizes supported
- Touch and mouse interactions

✅ **Professional UI**

- Clean design system
- Consistent spacing
- Smooth animations

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Auto-Deploy**: Automatic deployments on push to main branch
3. **Environment Variables**: Configure any required environment variables
4. **Custom Domain**: Optional custom domain configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Design Inspiration**: Dribbble security vulnerability kanban design
- **Icons**: Lucide React icon library
- **Animation**: Framer Motion library
- **Drag & Drop**: @dnd-kit library

---

**Built with ❤️ for the Frontend Engineer Assignment - Kraftbase**
