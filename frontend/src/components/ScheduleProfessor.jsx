import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUserRole } from "../utils/auth";
import ProfessorAttendance from "./ProfessorModal";

const ScheduleProfessor = () => {
  const [events, setEvents] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [termStats, setTermStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const role = getUserRole();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/terms/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const mapped = res.data.data
        .map((item) => {
          const term = item;

          if (!term.startTime || !term.endTime) return null;

          return {
            id: term.id,
            title: `${
              term.subject?.name ?? "Unknown subject"
            } (${term.startTime.slice(11, 16)} - ${term.endTime.slice(
              11,
              16
            )})`,
            start: term.startTime,
            end: term.endTime,
            extendedProps: term,
          };
        })
        .filter(Boolean);

      setEvents(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTermStatistics = async (termId) => {
    try {
      setLoadingStats(true);
      setTermStats(null);

      const res = await axios.get(
        `http://localhost:3000/api/terms/${termId}/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTermStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [role]);

  const handleEventClick = (info) => {
    const term = info.event.extendedProps;

    setSelectedTerm(term);
    setIsModalOpen(true);
    fetchTermStatistics(term.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="80vh"
        events={events}
        displayEventTime={false}
        eventClick={handleEventClick}
      />

      {isModalOpen && selectedTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedTerm.subject?.name}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              {selectedTerm.startTime.slice(11, 16)} –{" "}
              {selectedTerm.endTime.slice(11, 16)}
            </p>

            <div className="mb-4">
              {loadingStats && <p>Loading...</p>}
              {!loadingStats && !termStats && <p>No statistics available.</p>}
            </div>

            {role === "PROFESSOR" && (
              <div className="border-t pt-4">
                <ProfessorAttendance stats={termStats} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleProfessor;
