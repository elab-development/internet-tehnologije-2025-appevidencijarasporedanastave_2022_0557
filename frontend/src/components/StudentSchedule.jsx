import { useEffect, useState } from "react";
import axios from "axios";

const StudentSchedule = () => {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/terms/student", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(res => setTerms(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>

      {terms.map(t => (
        <div key={t.id} className="border p-3 mb-2 rounded">
          <b>{t.subject.name}</b> – {t.type} <br />
          {new Date(t.date).toLocaleDateString()} {t.startTime}
        </div>
      ))}
    </div>
  );
};

export default StudentSchedule;
