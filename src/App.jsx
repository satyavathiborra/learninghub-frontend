import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Landing from './Landing';
import Login from './authenticationpages/login';
import StudentDashboard from './pages/student/StudentDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import ForgotPassword from './authenticationpages/ForgotPassword';
import InsAddCourse from './pages/instructor/InsAddCourse';
import InsAddCourseContent from './pages/instructor/InsAddCourseContent';
import StudentCourseContent from './pages/student/StudentCourseContent';
import RegisteredCoursesViewer from './pages/student/MyCourses';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) return <Navigate to="/login" />;
        return children;
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/course-content-view" element={<StudentCourseContent />} />

                {/* Protected Routes */}
                <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="/instructor-dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
                <Route path="/InsAddCourse" element={<ProtectedRoute><InsAddCourse /></ProtectedRoute>} />
                <Route path="/InsAddCourseContent" element={<ProtectedRoute><InsAddCourseContent /></ProtectedRoute>} />
                <Route path="/registered-courses" element={<ProtectedRoute><RegisteredCoursesViewer /></ProtectedRoute>} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
