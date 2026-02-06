import { useEffect, useState } from "react";

const AddTerm = () => {
  const [subjects, setSubjects] = useState([]);
  const [professors, setProfessors] = useState([]);

  const [form, setForm] = useState({
    subjectId: "",
    professorId: "",
    date: "",
    startTime: "",
    endTime: "",
    classroom: "",
    type: "LECTURE",
    idGroup: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubjects();
    fetchProfessors();
  }, []);

  const fetchSubjects = async () => {
    const res = await fetch("http://localhost:3000/api/subjects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSubjects(data.data || []);
  };

  const fetchProfessors = async () => {
    const res = await fetch("http://localhost:3000/api/users/professors", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfessors(data.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toISO = (date, time) => new Date(`${date}T${time}`).toISOString();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      subjectId: Number(form.subjectId),
      professorId: Number(form.professorId),
      date: new Date(form.date).toISOString(),
      startTime: toISO(form.date, form.startTime),
      endTime: toISO(form.date, form.endTime),
      classroom: form.classroom,
      type: form.type,
      idGroup: Number(form.idGroup),
    };

    const res = await fetch("http://localhost:3000/api/terms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error");
      return;
    }

    alert("Term successfully created!");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Term</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="professorId"
          value={form.professorId}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        >
          <option value="">Select professor</option>
          {professors.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <div className="flex gap-4">
          <input
            type="time"
            name="startTime"
            onChange={handleChange}
            className="w-1/2 border rounded-lg px-4 py-2"
            required
          />
          <input
            type="time"
            name="endTime"
            onChange={handleChange}
            className="w-1/2 border rounded-lg px-4 py-2"
            required
          />
        </div>

        <input
          name="classroom"
          placeholder="Classroom"
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <select
          name="type"
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="LECTURE">Lecture</option>
          <option value="PRACTICE">Practice</option>
          <option value="LAB">Lab</option>
        </select>

        <input
          name="idGroup"
          placeholder="Group"
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Create Term
        </button>
      </form>
    </div>
  );
};

export default AddTerm;
