import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisteredCoursesViewer = () => {
  const [username, setUsername] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username) setUsername(storedUser.username);
    else setError('Username missing. Please log in.');
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!username) return;
        let response = await fetch(`http://localhost:8083/registered-courses?username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch registered courses');
        let data = await response.json();

        // Fix missing courseId by mapping courseHead to all courses
        if (data.some(c => !c.courseId)) {
          const allCoursesResponse = await fetch('http://localhost:8083/courses');
          if (allCoursesResponse.ok) {
            const allCourses = await allCoursesResponse.json();
            const courseMap = {};
            allCourses.forEach(course => { courseMap[course.courseHead] = course.courseId; });
            data = data.map(c => ({ ...c, courseId: c.courseId || courseMap[c.courseHead] }));
          }
        }

        setCourses(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, [username]);

  const handleViewContent = (courseId) => {
    navigate(`/course-content-view?courseId=${courseId}&username=${username}`);
  };

  return (
    <div>
      <h2>My Registered Courses</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {courses.length === 0 && !error && <p>No registered courses found.</p>}
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            {c.courseHead} (ID: {c.courseId}) - {c.percentage}%
            <button onClick={() => handleViewContent(c.courseId)}>View Content</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredCoursesViewer;
