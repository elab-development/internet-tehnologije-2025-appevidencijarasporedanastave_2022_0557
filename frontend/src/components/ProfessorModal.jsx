
const ProfessorAttendance = ({ stats }) => {

  if (!stats) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <h2 className="font-bold mb-2">Attendance</h2>
      <p>Present: {stats.present}</p>
    </div>
  );
};

export default ProfessorAttendance;
