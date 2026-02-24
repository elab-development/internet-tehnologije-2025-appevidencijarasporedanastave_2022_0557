import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUsers from "./components/AdminUsers";
import ScheduleStudent from "./components/ScheduleStudent";
import ScheduleProfessor from "./components/ScheduleProfessor";
import ScheduleUser from "./components/ScheduleUser";
import AddTerm from "./components/AddTerm";
import ProfessorAttendanceChart from "./components/ProffesorAttendanceChart"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <ScheduleStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-professor"
          element={
            <ProtectedRoute>
              <ScheduleProfessor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chart-professor"
          element={
            <ProtectedRoute>
              <ProfessorAttendanceChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-admin"
          element={<ProtectedRoute>{<AddTerm />}</ProtectedRoute>}
        />

        <Route path="/schedule/:userId" element={<ScheduleUser />} />
      </Routes>
    </Router>
  );
}

export default App;
