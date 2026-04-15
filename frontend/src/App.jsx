import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import SignupStudent from "./pages/SignupStudent.jsx";
import SignupAdmin from "./pages/SignupAdmin.jsx";
import SignupWorker from "./pages/SignupWorker.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import StudentLayout from "./pages/student/StudentLayout.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentComplaintsList from "./pages/student/StudentComplaintsList.jsx";
import StudentCleaning from "./pages/student/StudentCleaning.jsx";
import StudentComplaint from "./pages/student/StudentComplaint.jsx";
import StudentLaundry from "./pages/student/StudentLaundry.jsx";
import StudentMess from "./pages/student/StudentMess.jsx";
import StudentLostFound from "./pages/student/StudentLostFound.jsx";
import StudentNotices from "./pages/student/StudentNotices.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminComplaints from "./pages/admin/AdminComplaints.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminNotices from "./pages/admin/AdminNotices.jsx";
import AdminCleaning from "./pages/admin/AdminCleaning.jsx";
import AdminLaundry from "./pages/admin/AdminLaundry.jsx";
import AdminMess from "./pages/admin/AdminMess.jsx";
import AdminLostFound from "./pages/admin/AdminLostFound.jsx";

import WorkerLayout from "./pages/worker/WorkerLayout.jsx";
import WorkerDashboard from "./pages/worker/WorkerDashboard.jsx";
import WorkerTasks from "./pages/worker/WorkerTasks.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/student" element={<SignupStudent />} />
        <Route path="/signup/admin" element={<SignupAdmin />} />
        <Route path="/signup/worker" element={<SignupWorker />} />

        <Route element={<ProtectedRoute roles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="complaints-list" element={<StudentComplaintsList />} />
            <Route path="cleaning" element={<StudentCleaning />} />
            <Route path="complaint/:category" element={<StudentComplaint />} />
            <Route path="laundry" element={<StudentLaundry />} />
            <Route path="mess" element={<StudentMess />} />
            <Route path="lost-found" element={<StudentLostFound />} />
            <Route path="notices" element={<StudentNotices />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="cleaning" element={<AdminCleaning />} />
            <Route path="laundry" element={<AdminLaundry />} />
            <Route path="mess" element={<AdminMess />} />
            <Route path="lost-found" element={<AdminLostFound />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["worker"]} />}>
          <Route path="/worker" element={<WorkerLayout />}>
            <Route index element={<WorkerDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="tasks" element={<WorkerTasks />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
