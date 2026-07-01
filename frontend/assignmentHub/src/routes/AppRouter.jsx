import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import LecturerDashboard from "../pages/LecturerDashboard";
import StudentDashboard from "../pages/StudentDashboard";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lecturerDashboard" element={<LecturerDashboard />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
