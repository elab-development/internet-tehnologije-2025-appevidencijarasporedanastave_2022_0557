
const AttendanceModal = ({ term, onClose, onMark }) => {
  if (!term) return null;

  const termId = term.termId;
  const userId = term.userId;
  const startTime = term.term?.startTime?.slice(11, 16);
  const endTime = term.term?.endTime?.slice(11, 16);
  const subjectName = term.subject.name;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{subjectName}</h2>
        <p className="mb-4">
          {startTime} - {endTime}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => onMark(userId, termId, "PRESENT")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            PRESENT
          </button>
          <button
            onClick={() => onMark(userId, termId, "ABSENT")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            ABSENT
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
