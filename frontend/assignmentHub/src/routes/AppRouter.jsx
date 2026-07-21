import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const LecturerDashboard = lazy(() => import("../pages/LecturerDashboard"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import Loader from "../components/Loader";
import Assignment from "../components/student/Assignment";
import Profile from "../components/student/Profile";
import SDashboard from "../components/student/SDashboard";
import MyCourses from "../components/student/MyCourses";
import LDashboard from "../components/lecturer/LDashboard";
import LecturerSubmissions from "../components/lecturer/LecturerSubmissions";
import CreateAssignment from "../components/lecturer/CreateAssignment";
import LecturerCourses from "../components/lecturer/LecturerCourses";
import LecturerCourseDetails from "../components/lecturer/LecturerCourseDetails";
import CourseDetails from "../components/student/CourseDetails";
import DiscoverCourses from "../components/student/DiscoverCourses";
import AssignmentDetail from "../components/student/AssignmentDetail";

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRouter;
