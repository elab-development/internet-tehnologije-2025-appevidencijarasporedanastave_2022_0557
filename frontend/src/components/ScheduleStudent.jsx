import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getUserRole } from "../utils/auth";
import AttendanceModal from "./AttendanceModal";

const ScheduleStudent = () => {
  const [events, setEvents] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [loadingSync, setLoadingSync] = useState(false);

  const role = getUserRole();

  const API_BASE_URL = "http://localhost:3000/api";
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  /* ================= FETCH EVENTS ================= */

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/terms/my`, authHeader);

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
          backgroundColor: color,
          extendedProps: item,
        };
      });

      setEvents(mapped);
    } catch (err) {
      console.error("Greška pri učitavanju termina:", err);
    }
  }, []);

  /* ================= AUTOMATSKI BULK SYNC ================= */

  const syncAllToGoogle = useCallback(async () => {
    setLoadingSync(true);
    try {
      // Pozivamo novu rutu koju smo dodali na backendu
      const res = await axios.post(`${API_BASE_URL}/google/sync-all`, {}, authHeader);
      alert(`Uspešno sinhronizovano ${res.data.data.count} termina sa Vašim Google kalendarom!`);
    } catch (err) {
      console.error("Greška pri automatskoj sinhronizaciji:", err);
      alert("Došlo je do greške prilikom automatskog prebacivanja termina.");
    } finally {
      setLoadingSync(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    const handleAuthMessage = (event) => {
      // Provera poruke sa backenda (iz callback popupa)
      if (event.data === "google-auth-success") {
        console.log("Google nalog povezan, pokrećem automatski sync...");
        syncAllToGoogle();
      }
    };

    window.addEventListener("message", handleAuthMessage);
    return () => window.removeEventListener("message", handleAuthMessage);
  }, [fetchEvents, syncAllToGoogle]);

  /* ================= GOOGLE CONNECT ================= */

  const handleConnectGoogle = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/google/auth`, authHeader);
      const authUrl = res.data.data?.url || `${API_BASE_URL}/google/auth`;

      // Otvaramo Google OAuth u novom prozoru
      window.open(authUrl, "GoogleAuth", "width=600,height=700");
    } catch (err) {
      alert("Greška pri generisanju Google linka.");
    }
  };

  /* ================= POJEDINAČNI SYNC (UNUTAR MODALA) ================= */

  const handleGoogleSync = async (termData) => {
    setLoadingSync(true);
    try {
      await axios.post(
        `${API_BASE_URL}/google/sync-event`,
        {
          termId: termData.term.id,
          subjectName: termData.term.subject.name,
          startTime: termData.term.startTime,
          endTime: termData.term.endTime,
        },
        authHeader
      );

      alert("Uspešno dodato u Google kalendar!");
    } catch (err) {
      alert("Greška pri sinhronizaciji. Proverite da li ste povezali Google nalog.");
    } finally {
      setLoadingSync(false);
    }
  };

  /* ================= ATTENDANCE ================= */

  const markAttendance = async (userId, termId, status) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/attendance/${termId}`,
        { status },
        authHeader
      );

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === termId
            ? {
                ...ev,
                backgroundColor: status === "PRESENT" ? "green" : "red",
                extendedProps: {
                  ...ev.extendedProps,
                  status,
                },
              }
            : ev
        )
      );

      setSelectedTerm(null);
    } catch (err) {
      alert("Failed to update attendance");
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Moj Raspored</h1>
          {loadingSync && (
            <p className="text-sm text-blue-600 animate-pulse font-medium">
              Sinhronizacija sa Google Kalendarom u toku...
            </p>
          )}
        </div>

        <button
          onClick={handleConnectGoogle}
          disabled={loadingSync}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition shadow-sm ${
            loadingSync 
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png"
            alt="G"
            className="w-5 h-5"
          />
          {loadingSync ? "Sinhronizacija..." : "Poveži Google Kalendar"}
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="75vh"
          events={events}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          eventClick={(info) => {
            // Modal se otvara na klik termina
            setSelectedTerm(info.event.extendedProps);
          }}
        />
      </div>

      {selectedTerm && role === "STUDENT" && (
        <AttendanceModal
          term={selectedTerm}
          role={role}
          onClose={() => setSelectedTerm(null)}
          onMark={markAttendance}
          onSync={() => handleGoogleSync(selectedTerm)}
          isSyncing={loadingSync}
        />
      )}
    </div>
  );
};

export default ScheduleStudent;