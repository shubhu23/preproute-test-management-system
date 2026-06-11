import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login";

import Dashboard from "./pages/Dashboard/Dashboard";

import CreateTest from "./pages/CreateTest/CreateTest";

import Questions from "./pages/Questions/AddQuestions";

import QuestionEditor from "./pages/Questions/QuestionEditor";

import PreviewPublish from "./pages/PreviewPublish/PreviewPublish";

import TestConfirmation from "./pages/TestConfirmation/TestConfirmation";

import SchedulePublish from "./pages/SchedulePublish/SchedulePublish";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tests"
            element={<Dashboard />}
          />

          <Route
            path="/tests/create"
            element={<CreateTest />}
          />

          <Route
            path="/tests/:id/edit"
            element={<CreateTest />}
          />

          <Route
            path="/tests/:id/view"
            element={<CreateTest />}
          />

          <Route
            path="/tests/:id/questions"
            element={<Questions />}
          />

          <Route
            path="/tests/confirmation"
            element={<TestConfirmation />}
          />

          <Route
            path="/tests/questions/editor/:questionId"
            element={<QuestionEditor />}
          />

          <Route
            path="/tests/publish"
            element={<PreviewPublish />}
          />

          <Route
            path="/tests/preview"
            element={<PreviewPublish />}
          />

          <Route
            path="/tests/schedule-publish"
            element={<SchedulePublish />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
