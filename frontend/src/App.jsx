import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUsers from "./components/AdminUsers";
import StudentSchedule from "./components/StudentSchedule";

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
              <StudentSchedule />
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
        <Route path="/schedule/:userId" element={<StudentSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
