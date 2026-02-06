import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfessorAttendance from "./ProfessorModal";

const ScheduleUser = () => {
  const [events, setEvents] = useState([]);
  const { userId } = useParams();

  const [selectedTerm, setSelectedTerm] = useState(null);
  const [termStats, setTermStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchEvents = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`http://localhost:3000/api/terms/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("RAW data:", res.data);

      const mapped = res.data.data.map((item) => ({
        id: item.id,
        title: `${item.term?.subject?.name} (${item.term?.startTime?.slice(
          11,
          16
        )} - ${item.term?.endTime?.slice(11, 16)})`,
        start: item.term?.startTime,
        end: item.term?.endTime,
        extendedProps: item,
      }));

      setEvents(mapped);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const fetchTermStatistics = async (termId) => {
    try {
      console.log(termId);
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

  const handleEventClick = (info) => {
    const term = info.event.extendedProps;
    setSelectedTerm(term);
    setIsModalOpen(true);
    fetchTermStatistics(term.termId);
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
              {selectedTerm.term?.startTime?.slice(11, 16) || "??:??"} –{" "}
              {selectedTerm.term?.endTime?.slice(11, 16) || "??:??"}
            </p>

            <div className="mb-4">
              {loadingStats && <p>Loading...</p>}

              {!loadingStats && !termStats && <p>No statistics available.</p>}
            </div>
            <div className="border-t pt-4">
              <ProfessorAttendance stats={termStats} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleUser;
