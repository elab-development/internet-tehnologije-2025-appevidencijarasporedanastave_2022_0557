import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUserRole } from "../utils/auth";
import AttendanceModal from "./AttendanceModal";

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const role = getUserRole();

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/terms/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const mapped = res.data.data.map((item) => {
        const status = item.status;

        let color;
        switch (status) {
          case "PRESENT":
            color = "green";
            break;
          case "ABSENT":
            color = "red";
            break;
          default:
            color = "yellow";
        }

        return {
          id: item.term.id,
          title: `${item.term.subject.name} (${item.term.startTime.slice(
            11,
            16
          )} - ${item.term.endTime.slice(11, 16)})`,
          start: item.term.startTime,
          end: item.term.endTime,
          subject: item.term.subject.name,
          backgroundColor: color,
          extendedProps: item,
        };
      });

      setEvents(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [role]);

  const markAttendance = async (userId, termId, status) => {
    if (!selectedTerm) return;
    console.log("Sending attendance update:", { userId, termId, status });

    try {
      await axios.patch(
        `http://localhost:3000/api/attendance/${termId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === termId
            ? {
                ...ev,
                backgroundColor: status === "PRESENT" ? "green" : "red",
                extendedProps: { ...ev.extendedProps, status },
              }
            : ev
        )
      );

      setSelectedTerm(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date()}
        height="80vh"
        expandRows
        events={events}
        displayEventTime={false}
        eventClick={(info) => {
          if (info.event.backgroundColor === "yellow") {
            setSelectedTerm(info.event.extendedProps);
          }
        }}
      />

      {selectedTerm && role === "STUDENT" && (
        <AttendanceModal
          term={selectedTerm}
          onClose={() => setSelectedTerm(null)}
          onMark={markAttendance}
        />
      )}
    </div>
  );
};

export default Schedule;
