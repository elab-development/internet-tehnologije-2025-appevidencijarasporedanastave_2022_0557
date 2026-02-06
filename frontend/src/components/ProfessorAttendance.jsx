import { useEffect, useState } from "react";
import axios from "axios";

const ProfessorAttendance = ({ termId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/attendance/${termId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setStats(res.data.data));
  }, [termId]);

  if (!stats) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h2 className="font-bold mb-2">Attendance</h2>
      <p>Present: {stats.present}</p>
    </div>
  );
};

export default ProfessorAttendance;
