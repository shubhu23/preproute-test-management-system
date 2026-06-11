# Preproute Test Management App - Complete Documentation

---

## Table of Contents
- [Application Overview](#application-overview)
- [Task Requirements](#task-requirements)
- [Technical Stack](#technical-stack)
- [Application Architecture](#application-architecture)
- [File Structure & Relationships](#file-structure--relationships)
- [Complete User Flow](#complete-user-flow)
- [How Components Work Together](#how-components-work-together)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Code Cleanup Summary](#code-cleanup-summary)
- [Build & Run](#build--run)

---

## Application Overview

**Preproute Test Management System** is a comprehensive frontend application for educators and administrators to create, manage, and publish online examinations. The application provides an intuitive interface for test configuration, question management, and publication scheduling.

### Key Features:
- ✅ **User Authentication** - Secure login with JWT tokens
- ✅ **Test Dashboard** - View, filter, and manage all created tests
- ✅ **Test Creation** - Create tests with multiple types (Chapter Wise, PYQ, Mock)
- ✅ **Question Management** - Add and edit MCQ questions with options
- ✅ **Test Publishing** - Preview, publish immediately, or schedule for later
- ✅ **Responsive Design** - Mobile-friendly Material-UI interface
- ✅ **API Integration** - Full CRUD operations with backend APIs

---

## Task Requirements

### 5-Page Application Requirements:

| Page | Route | Purpose | Features |
|------|-------|---------|----------|
| **Login** | `/login` | User authentication | Username/password form, error handling, token storage |
| **Dashboard** | `/dashboard` | Test management hub | View tests, filter by status/subject, search, delete |
| **Create Test** | `/tests/create` | Test configuration | Name, subject, topics, marking scheme, test type |
| **Add Questions** | `/tests/:id/questions` | Question management | Add MCQ, options, correct answer, difficulty, solution |
| **Preview & Publish** | `/tests/publish` | Test publication | Review test, publish, or schedule for later date |

### Evaluation Criteria:
- **Code Quality & Structure** (30%) - Clean, modular, well-organized code
- **Functionality & API Integration** (40%) - All features working, proper API calls
- **UI/UX Implementation** (20%) - Matching Figma design guidelines
- **Best Practices & Documentation** (10%) - Comments, README, proper patterns

---

## Technical Stack

### Frontend Frameworks & Libraries:
- **React 19.x** - UI library with modern hooks
- **TypeScript 6.x** - Type-safe development
- **Material-UI 9.x** - Component library and styling (sx props)
- **React Router 7.x** - Client-side routing

### State Management & Data Fetching:
- **Redux Toolkit 2.x** - Global state management (auth)
- **React Query 5.x** - Server state, caching, synchronization
- **localStorage** - Persistent client-side storage for test context

### Forms & Validation:
- **React Hook Form 7.x** - Efficient form management
- **Zod 4.x** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between Hook Form and Zod

### API & HTTP:
- **Axios 1.x** - HTTP client with interceptors for auth
- **Custom axios instance** - Base URL, auth headers, error handling

### UI & Styling:
- **Emotion/Styled Components** - CSS-in-JS from Material-UI
- **Material-UI Icons** - Icon library
- **React Toastify** - Toast notifications

### Utilities:
- **Dayjs** - Date manipulation and formatting
- **React Toastify** - User notifications

### Development Tools:
- **Vite 8.x** - Fast build tool and dev server
- **ESLint** - Code quality and style consistency
- **TypeScript Compiler** - Type checking

---

## Application Architecture

### Architecture Overview:

```
┌─────────────────────────────────────────────────────────────┐
│                        React Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              UI Components Layer                        │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │  Login   │ │Dashboard │ │CreateTest│ │Questions │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Hooks & Custom Logic Layer                   │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │ │
│  │  │  useTests()  │ │useQuestions()│ │ useSubjects()│  │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    State Management & Data Fetching Layer              │ │
│  │  ┌──────────────┐  ┌──────────────┐ ┌──────────────┐  │ │
│  │  │   Redux      │  │ React Query  │ │ localStorage │  │ │
│  │  │  (Auth)      │  │  (Server)    │ │ (Session)    │  │ │
│  │  └──────────────┘  └──────────────┘ └──────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            API Integration Layer                        │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │
│  │  │  authApi.ts  │ │  testApi.ts  │ │questionApi.ts│   │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘   │ │
│  │              ▼ Axios Instance ▼                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Backend API Server                             │ │
│  │  https://admin-moderator-backend-staging.up.railway.app/api
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow:

```
User Interaction → Component State → Custom Hook → Query/Mutation 
  → Axios Instance → Backend API → Response → Query Cache 
  → Component Re-render
```

---

## File Structure & Relationships

### Directory Structure:

```
src/
├── api/                           # API Integration Layer
│   ├── axios.ts                  # Axios instance with interceptors
│   ├── authApi.ts               # Authentication endpoints
│   ├── testApi.ts               # Test CRUD endpoints
│   ├── questionApi.ts           # Question CRUD endpoints
│   └── subjectApi.ts            # Subject/Topic/SubTopic endpoints
│
├── app/                          # Redux Store Configuration
│   └── store.ts                 # Redux store setup
│
├── features/                     # Redux State Slices
│   ├── auth/
│   │   └── authSlice.ts         # Auth state (login, logout, token)
│   └── tests/
│       └── testSlice.ts         # Test state (preserved for future)
│
├── hooks/                        # Custom React Hooks
│   ├── useDebounce.ts           # Debounce search input
│   ├── useDeleteTest.ts         # Delete test mutation
│   ├── useFetchQuestions.ts     # Fetch questions by IDs
│   ├── usePublishTest.ts        # Publish test mutation
│   ├── useQuestions.ts          # Create/update questions
│   ├── useSubjects.ts           # Fetch subjects/topics
│   └── useTests.ts              # Test queries & mutations
│
├── types/                        # TypeScript Interfaces
│   ├── test.ts                  # Test interface definition
│   └── question.ts              # Question interface definition
│
├── components/                   # Reusable Components
│   ├── Layout/
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── Header.tsx           # Header with user menu
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── sidebarConfig.ts     # Sidebar menu items
│   │   └── SidebarItem.tsx      # Individual menu item
│   ├── Filters/
│   │   ├── SearchBar.tsx        # Search input with debounce
│   │   └── TestFilters.tsx      # Status/Subject/Sort filters
│   ├── TestTable/
│   │   └── TestTable.tsx        # Tests data grid component
│   ├── DeleteTestDialog/
│   │   └── DeleteTestDialog.tsx # Delete confirmation modal
│   └── CreateTestButton/
│       └── CreateTestButton.tsx # Create test button
│
├── pages/                        # Page Components (Routes)
│   ├── Login/
│   │   └── Login.tsx            # Authentication page
│   ├── Dashboard/
│   │   └── Dashboard.tsx        # Tests management dashboard
│   ├── CreateTest/
│   │   └── CreateTest.tsx       # Test creation & editing
│   ├── Questions/
│   │   ├── AddQuestions.tsx     # Question listing & management
│   │   ├── QuestionForm.tsx     # Question form component
│   │   ├── QuestionCard.tsx     # Question display card
│   │   ├── QuestionEditor.tsx   # Question editing interface
│   │   └── QuestionPreview.tsx  # Question preview
│   ├── PreviewPublish/
│   │   ├── PreviewPublish.tsx   # Test preview page
│   │   ├── TestSummary.tsx      # Test summary display
│   │   └── QuestionPreview.tsx  # Questions preview
│   ├── TestConfirmation/
│   │   └── TestConfirmation.tsx # Test creation confirmation
│   └── SchedulePublish/
│       └── SchedulePublish.tsx  # Test scheduling interface
│
├── routes/
│   └── ProtectedRoute.tsx       # Route protection HOC
│
├── assets/                       # Static assets
│   ├── logo.svg
│   └── robot.svg
│
├── App.tsx                       # Main app component with routing
├── main.tsx                      # React DOM render entry
├── index.css                     # Global styles
└── App.css                       # App-specific styles
```

### File Relationships & Data Flow:

#### **Authentication Flow:**
```
Login.tsx
  ↓ (calls)
authApi.ts → loginUser()
  ↓ (uses)
axios.ts → POST /auth/login
  ↓ (stores)
localStorage.setItem("token")
Redux authSlice → loginSuccess(token)
  ↓ (protects)
ProtectedRoute.tsx → <Outlet />
```

#### **Test Management Flow:**
```
Dashboard.tsx
  ├─ (calls)
  │   useTests() → React Query
  │     ↓
  │   testApi.ts → getTests()
  │     ↓
  │   axios.ts → GET /tests
  │
  ├─ (calls)
  │   useSubjects() → React Query
  │     ↓
  │   subjectApi.ts → getSubjects()
  │     ↓
  │   axios.ts → GET /subjects
  │
  └─ (displays)
      TestTable.tsx + Filters
```

#### **Test Creation Flow:**
```
Dashboard.tsx → CreateTest.tsx
  ├─ (user fills)
  │   Form fields (name, subject, marking scheme)
  │     ↓
  │   formData state
  │     ↓
  │   handleNext()
  │     ↓
  ├─ (calls)
  │   useCreateTest() mutation
  │     ↓
  │   testApi.ts → createTest(payload)
  │     ↓
  │   axios.ts → POST /tests
  │     ↓
  │   Response with test ID
  │     ↓
  │   localStorage.setItem("currentTestId", id)
  │
  └─ (navigates)
      AddQuestions.tsx
```

#### **Question Management Flow:**
```
AddQuestions.tsx
  ├─ (uses)
  │   useCreateQuestions() mutation
  │     ↓
  │   questionApi.ts
  │     ↓
  │   axios.ts → POST /questions
  │
  ├─ (manages)
  │   questions[] state
  │     ↓
  │   handleAddQuestion() / handleDelete()
  │
  └─ (stores)
      localStorage.setItem("questionIds", [...ids])
        ↓
      navigate("/tests/confirmation")
```

#### **Test Publishing Flow:**
```
TestConfirmation.tsx
  ├─ (fetches)
  │   useTest(testId)
  │   useFetchQuestions(questionIds)
  │
  ├─ (offers options)
  │   "Publish Now" → PreviewPublish.tsx
  │       ↓
  │       usePublishTest() mutation
  │         ↓
  │         testApi.ts → PUT /tests/{id}
  │           ↓
  │           axios.ts → { status: "live" }
  │
  │   "Schedule Publish" → SchedulePublish.tsx
  │       ↓
  │       Date/Time selection
  │         ↓
  │         usePublishTest() mutation
  │           ↓
  │           testApi.ts → Scheduled date payload
  │
  └─ navigate("/dashboard")
```

---

## Complete User Flow

### 1. **Login Flow:**
```
User visits application
  ↓
Redirected to /login (not authenticated)
  ↓
User enters credentials (vedant-admin / vedant123)
  ↓
Login.tsx → loginUser(username, password)
  ↓
Token received & stored in localStorage
  ↓
Redirected to /dashboard
```

### 2. **Dashboard Flow:**
```
Dashboard displays all tests
  ├─ Fetch: useTests() → All tests data
  ├─ Fetch: useSubjects() → Filter subjects
  │
  ├─ Search: useDebounce(search) → Filter by name
  ├─ Filter: By status (draft/live/scheduled)
  ├─ Filter: By subject
  ├─ Sort: By newest/oldest
  │
  ├─ Actions available:
  │   ├─ View test → Navigate to /tests/{id}/view
  │   ├─ Edit test → Navigate to /tests/{id}/edit
  │   ├─ Add questions → Navigate to /tests/{id}/questions
  │   └─ Delete test → DeleteTestDialog confirmation
  │
  └─ Create new test → Navigate to /tests/create
```

### 3. **Test Creation Flow:**
```
CreateTest.tsx (/tests/create or /tests/{id}/edit)
  ├─ Form fields:
  │   ├─ Test type (tabs: Chapter Wise, PYQ, Mock)
  │   ├─ Name of test
  │   ├─ Subject (dropdown → getSubjects())
  │   ├─ Topic (cascading → getTopicsBySubject())
  │   ├─ Sub Topic (cascading → getSubTopics())
  │   ├─ Duration (minutes)
  │   └─ Marking scheme:
  │       ├─ Correct answer marks
  │       ├─ Wrong answer marks
  │       └─ Unattempted marks
  │
  ├─ Edit Mode (if /tests/{id}/edit):
  │   └─ Pre-populate all fields from API
  │
  └─ Submit:
      ├─ Create: POST /tests → localStorage.setItem("currentTestId")
      └─ Edit: PUT /tests/{id}
         ↓
      Navigate to /tests/{id}/questions
```

### 4. **Question Management Flow:**
```
AddQuestions.tsx (/tests/{id}/questions)
  ├─ Display total questions counter
  ├─ Add questions form:
  │   └─ QuestionForm.tsx
  │       ├─ Question text (textarea)
  │       ├─ Options (4-6 options)
  │       ├─ Select correct option (radio)
  │       ├─ Difficulty level
  │       ├─ Subject (dropdown)
  │       └─ Solution/Explanation
  │
  ├─ Questions list:
  │   └─ QuestionCard.tsx (for each question)
  │       ├─ Display question text
  │       ├─ Edit button → QuestionEditor.tsx
  │       └─ Delete button → Remove from list
  │
  └─ Actions:
      ├─ Add question → Add to local state
      ├─ Edit question → Update local state
      ├─ Delete question → Remove from local state
      └─ Save all questions:
          ├─ POST /questions (batch create)
          ├─ Store question IDs in localStorage
          └─ Navigate to /tests/confirmation
```

### 5. **Test Confirmation & Publishing Flow:**
```
TestConfirmation.tsx (/tests/confirmation)
  ├─ Display test summary:
  │   ├─ Test name & type badge
  │   ├─ Subject, topic, sub-topic
  │   ├─ Time, questions count, marks
  │   └─ Success banner (all questions added)
  │
  ├─ Option A: "Publish Now"
  │   └─ Navigate to /tests/publish
  │       └─ PreviewPublish.tsx
  │           ├─ Display full test preview
  │           ├─ Show all questions
  │           └─ Publish button
  │               ├─ Call usePublishTest()
  │               ├─ Update test status to "live"
  │               └─ Redirect to /dashboard
  │
  └─ Option B: "Schedule Publish"
      └─ Navigate to /tests/schedule-publish
          └─ SchedulePublish.tsx
              ├─ Publish type selection:
              │   ├─ "Publish Now" radio
              │   └─ "Schedule" radio
              │       └─ Date & time pickers appear
              │
              ├─ "Live Until" options:
              │   ├─ Always available
              │   ├─ 1 Week
              │   ├─ 2 Weeks
              │   ├─ 3 Weeks
              │   ├─ 1 Month
              │   └─ Custom duration
              │
              └─ Submit:
                  ├─ Validate date/time
                  ├─ Call usePublishTest()
                  └─ Redirect to /dashboard
```

---

## How Components Work Together

### **API Integration Architecture:**

```typescript
// src/api/axios.ts - Foundation Layer
- Creates axios instance with baseURL
- Adds Authorization header interceptor
- Handles 401 errors (redirect to login)
  ↓
// src/api/*.ts - API Layer
- authApi.ts: loginUser(), logoutUser()
- testApi.ts: getTests(), createTest(), updateTest(), deleteTest(), publishTest()
- questionApi.ts: createQuestions(), updateQuestion(), deleteQuestion()
- subjectApi.ts: getSubjects(), getTopicsBySubject(), getSubTopics()
  ↓
// src/hooks/*.ts - Custom Hooks Layer (React Query Integration)
- useTests(): useQuery + useMutation for test operations
- useCreateTest(): useMutation with cache invalidation
- useFetchQuestions(): useQuery with batch fetch
  ↓
// src/pages/*.tsx - Component Layer
- Use hooks to fetch/mutate data
- Render UI based on state
- Handle user interactions
```

### **State Management Architecture:**

```
Redux (Global)                React Query (Server)        localStorage (Persistent)
┌──────────────────┐         ┌──────────────────┐        ┌──────────────────┐
│ authSlice        │         │ tests query      │        │ token            │
│ - token          │ ────→   │ questions query  │ ────→  │ currentTestId    │
│ - user info      │         │ subjects query   │        │ questionIds      │
└──────────────────┘         └──────────────────┘        └──────────────────┘
      ▲                             ▲                           ▲
      │                             │                           │
      └─ Dispatch on login    ┌─────┴────────────────────┘     │
                              │                                │
                              └─ Persist across sessions ──────┘
```

### **Component Hierarchy:**

```
App.tsx (Routes)
│
├─ <ProtectedRoute /> (Auth check)
│  │
│  ├─ Layout (Header + Sidebar wrapper)
│  │  │
│  │  ├─ Dashboard.tsx
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ TestFilters.tsx
│  │  │  └─ TestTable.tsx
│  │  │
│  │  ├─ CreateTest.tsx
│  │  │  ├─ Form fields
│  │  │  └─ Cascading dropdowns
│  │  │
│  │  ├─ AddQuestions.tsx
│  │  │  ├─ QuestionForm.tsx
│  │  │  └─ QuestionCard.tsx (list)
│  │  │
│  │  ├─ TestConfirmation.tsx
│  │  │  └─ TestSummary.tsx
│  │  │
│  │  ├─ PreviewPublish.tsx
│  │  │  ├─ TestSummary.tsx
│  │  │  └─ QuestionPreview.tsx (list)
│  │  │
│  │  └─ SchedulePublish.tsx
│  │     └─ TestSummary.tsx
│  │
│  └─ Header.tsx
│     └─ Logout button
│
└─ Login.tsx (Public route)
```

---

## API Integration

### **Axios Configuration:**

```typescript
// Base URL: https://admin-moderator-backend-staging.up.railway.app/api

// Request Interceptor:
- Adds Authorization header with token from localStorage
- Includes Content-Type: application/json

// Response Interceptor:
- Handles 401 Unauthorized → Clear token & redirect to /login
- Returns response data
- Rejects with error for 4xx/5xx responses
```

### **API Endpoints Used:**

| Method | Endpoint | Hook | Purpose |
|--------|----------|------|---------|
| POST | `/auth/login` | - | User login |
| GET | `/tests` | `useTests()` | Fetch all tests with filters |
| POST | `/tests` | `useCreateTest()` | Create new test |
| GET | `/tests/{id}` | `useTest()` | Fetch single test |
| PUT | `/tests/{id}` | `useUpdateTest()` | Update test details |
| DELETE | `/tests/{id}` | `useDeleteTest()` | Delete test |
| PUT | `/tests/{id}` | `usePublishTest()` | Publish/schedule test |
| POST | `/questions` | `useCreateQuestions()` | Batch create questions |
| PUT | `/questions/{id}` | `useUpdateQuestion()` | Update question |
| DELETE | `/questions/{id}` | - | Delete question |
| GET | `/subjects` | `useSubjects()` | Fetch all subjects |
| GET | `/subjects/{id}/topics` | - | Fetch topics for subject |
| GET | `/topics/{id}/sub-topics` | - | Fetch sub-topics |
| GET | `/questions/{ids}` | `useFetchQuestions()` | Batch fetch questions |

---

## State Management

### **Redux (Auth State):**
```typescript
// src/features/auth/authSlice.ts
{
  token: string | null,  // JWT token from login
}

// Actions:
- loginSuccess(token) → Save token to Redux and localStorage
- logout() → Clear token from Redux and localStorage
```

### **React Query (Server State):**
```typescript
// Queries:
- tests: Cached list of all tests (invalidated on create/update/delete)
- test:{id}: Single test details
- questions: Batch questions fetch
- subjects: Subject list

// Mutations:
- createTest: Create new test
- updateTest: Update test
- deleteTest: Delete test
- publishTest: Publish/schedule test
- createQuestions: Batch create questions
- updateQuestion: Update single question
```

### **localStorage (Session State):**
```typescript
{
  token: "jwt_token_here",              // Auth token
  currentTestId: "test_id",             // Current test being created/edited
  currentTestSubject: "subject_id",     // Current test's subject (for cascading)
  questionIds: [id1, id2, id3, ...]    // Question IDs created for test
}
```

---

## Build & Run Instructions

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/preproute-test-admin-panel.git
cd preproute-test-admin-panel

# Install dependencies
npm install

# Create environment file (if needed)
# Configure API base URL in src/api/axios.ts

# Start development server
npm run dev

# Application will be available at http://localhost:5173
```

### Available Scripts

```bash
# Development server (HMR enabled)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code for quality checks
npm lint
```

### Test Credentials
- **Username**: vedant-admin
- **Password**: vedant123

### API Configuration
The application connects to:
```
Base URL: https://admin-moderator-backend-staging.up.railway.app/api
```

---

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Key Features & Implementation Details

### Authentication
- JWT token-based authentication
- Token stored in localStorage for persistence
- Automatic redirect to login on 401 Unauthorized
- Logout clears token and redirects to login

### Test Management
- **Create**: Form with cascading dropdowns (Subject → Topic → Sub-topic)
- **Read**: Dashboard with search, filter, and sort functionality
- **Update**: Edit existing test details
- **Delete**: With confirmation dialog

### Question Management
- Add multiple choice questions with 4-6 options
- Select correct option via radio button
- Add difficulty level and explanation
- Batch upload all questions at once
- Edit or delete individual questions

### Publishing Options
- Publish immediately (status: "live")
- Schedule for future date and time
- Set availability duration (1 week, 2 weeks, 1 month, etc.)

### Responsive Design
- Mobile-first approach using Material-UI
- Optimized for mobile (< 600px), tablet (600px - 1200px), and desktop (> 1200px)
- Touch-friendly interfaces
- Sidebar collapses on mobile

---

## Technical Decisions & Best Practices

### Why React Query over Redux for Server State?
- Better cache management and automatic re-fetching
- Built-in request deduplication
- Reduces boilerplate compared to Redux thunks
- Automatic background refetching
- Better developer experience with built-in devtools

### Why localStorage for Test Context?
- Simple persistence across page refreshes
- Reduces API calls during multi-step forms
- Fast access without network latency
- Suitable for session-specific data

### Component Structure
- **Container Components**: Manage state and data fetching (pages)
- **Presentational Components**: Pure UI components (components folder)
- **Custom Hooks**: Encapsulate API logic and side effects
- **Separation of Concerns**: API layer, hooks layer, component layer

### Type Safety
- Full TypeScript implementation
- Interface definitions for all API responses
- Type-safe API calls and state management
- Compile-time error detection

---

## Troubleshooting

### Common Issues

#### 1. API Connection Errors
- Verify API endpoint is accessible
- Check network tab in browser DevTools
- Ensure CORS is properly configured on backend

#### 2. Authentication Failures
- Verify credentials are correct (vedant-admin / vedant123)
- Check if token is being stored in localStorage
- Clear localStorage and try again

#### 3. Cascading Dropdowns Not Working
- Verify subject is selected first
- Check API response for topics and sub-topics
- Ensure cascading data is returned from backend

#### 4. Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Rebuild: `npm run build`

---

## Project Status

### Completed Features ✅
- User login/logout
- Dashboard with test management
- Test creation with cascading dropdowns
- Question management (add/edit/delete)
- Test preview
- Test publishing (immediate)
- Test scheduling
- Responsive UI
- API integration

---

## Data Management
- Test ID stored in localStorage as `currentTestId`
- Question IDs stored in localStorage as `questionIds` array
- Uses existing API hooks:
  - `useTest()` - Fetch test details
  - `useFetchQuestions()` - Fetch question details
  - `usePublishTest()` - Publish test to API

## Styling
- Uses Material-UI theming and styling system (sx props)
- Consistent with existing app design
- Color scheme:
  - Primary actions: #6366f1 (Indigo)
  - Success states: #10b981 (Green)
  - Error states: #ef4444 (Red)
  - Text: Grayscale (#6b7280 for secondary text)

## Build & Run

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```
