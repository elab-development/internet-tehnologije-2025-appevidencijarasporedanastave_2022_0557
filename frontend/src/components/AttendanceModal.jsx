const AttendanceModal = ({ term, onClose, onMark, role, onSync, isSyncing }) => {
  if (!term) return null;

  // Podrška za obe moguće strukture
  const termId = term.termId || term.id || term.term?.id;
  const userId = term.userId;

  const startTime =
    term.startTime?.slice(11, 16) ||
    term.term?.startTime?.slice(11, 16);

  const endTime =
    term.endTime?.slice(11, 16) ||
    term.term?.endTime?.slice(11, 16);

  const subjectName =
    term.subjectName ||
    term.term?.subject?.name ||
    "Nepoznat predmet";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <h2 className="text-xl font-bold mb-2">{subjectName}</h2>

        <p className="mb-4 text-gray-600">
          {startTime} - {endTime}
        </p>

        {role === "STUDENT" && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => onMark(userId, termId, "PRESENT")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              PRESENT
            </button>

            <button
              onClick={() => onMark(userId, termId, "ABSENT")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              ABSENT
            </button>
          </div>
        )}


        <button
          onClick={onClose}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
        >
          Zatvori
        </button>
      </div>
    </div>
  );
};

export default AttendanceModal;