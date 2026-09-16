import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthLayout from "../components/layouts/AuthLayout";
const Landing = lazy(() => import("../pages/Landing"));
import Login from "../pages/Login";
import Register from "../pages/Register";
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const LecturerDashboard = lazy(() => import("../pages/LecturerDashboard"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import Loader from "../components/Loader";
const Assignment = lazy(() => import("../components/student/Assignment"));
const Profile = lazy(() => import("../components/student/Profile"));
const SDashboard = lazy(() => import("../components/student/SDashboard"));
const MyCourses = lazy(() => import("../components/student/MyCourses"));
const LDashboard = lazy(() => import("../components/lecturer/LDashboard"));
const LecturerSubmissions = lazy(() => import("../components/lecturer/LecturerSubmissions"));
const CreateAssignment = lazy(() => import("../components/lecturer/CreateAssignment"));
const LecturerCourses = lazy(() => import("../components/lecturer/LecturerCourses"));
const LecturerCourseDetails = lazy(() => import("../components/lecturer/LecturerCourseDetails"));
const CourseDetails = lazy(() => import("../components/student/CourseDetails"));
const DiscoverCourses = lazy(() => import("../components/student/DiscoverCourses"));
const AssignmentDetail = lazy(() => import("../components/student/AssignmentDetail"));

const AppRoutes = () => {
  const location = useLocation();

  const routes = (
    <Routes location={location}>
      <Route path="/" element={<Landing />} />
      <Route element={<AuthLayout />} >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/lecturerDashboard"
        element={
          <ProtectedRoute role="lecturer">
            <LecturerDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<LDashboard />} />
        <Route path="courses" element={<LecturerCourses />} />
        <Route path="courses/:id" element={<LecturerCourseDetails />} />
        <Route path="createAssignment" element={<CreateAssignment />} />
        <Route path="submissions" element={<LecturerSubmissions />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route
        path="/studentDashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<SDashboard />} />
        <Route path="assignments" element={<Assignment />} />
        <Route path="assignments/:id" element={<AssignmentDetail />} />
        <Route path="mycourses" element={<MyCourses />} />
        <Route path="discoverCourses" element={<DiscoverCourses />} />
        <Route path="mycourses/:id" element={<CourseDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return routes;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader fullScreen label="Opening Assignment Hub" />}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRouter;
