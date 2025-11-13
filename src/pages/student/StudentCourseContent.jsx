import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const StudentCourseContent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  const [username, setUsername] = useState(queryParams.get('username') || '');
  const [contents, setContents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.username) setUsername(storedUser.username);
      else setError('Username missing. Please log in.');
    }
  }, [username]);

  useEffect(() => {
    if (!username || !courseId) return;
    const fetchContent = async () => {
      try {
        const res = await fetch(`http://localhost:8083/student-course-content?username=${username}&courseId=${courseId}`);
        if (!res.ok) throw new Error('Failed to fetch content');
        const data = await res.json();
        if (!data || data.length === 0) setError('No content found.');
        else { setContents(data); setError(''); }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchContent();
  }, [username, courseId]);

  return (
    <div>
      <h2>Course Content for {courseId || 'Unknown Course'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {contents.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Course ID</th>
              <th>Module</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {contents.map(content => (
              <tr key={content.id}>
                <td>{content.id}</td>
                <td>{content.username}</td>
                <td>{content.courseId}</td>
                <td>{content.module}</td>
                <td>{content.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentCourseContent;
