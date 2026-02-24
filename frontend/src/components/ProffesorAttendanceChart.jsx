import { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const ProfessorAttendanceChart = () => {
  const [chartData, setChartData] = useState([
    ["Termin", "Broj prisutnih"],
  ]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const termsRes = await axios.get(
          "http://localhost:3000/api/terms/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const terms = termsRes.data.data;

        const statsRows = await Promise.all(
          terms.map(async (term) => {
            const statRes = await axios.get(
              `http://localhost:3000/api/terms/${term.id}/stats`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            return [
              `${new Date(term.date).toLocaleDateString()} • ${term.subject.name}`,
              statRes.data.data.present,
            ];
          })
        );

        setChartData([
          ["Termin", "Broj prisutnih"],
          ...statsRows,
        ]);
      } catch (err) {
        console.error("Error loading attendance stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-10">Loading chart...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Prisustvo studenata po terminima
      </h2>

      <Chart
        chartType="BarChart"
        width="100%"
        height={`${chartData.length * 55}px`}
        data={chartData}
        options={{
          legend: { position: "none" },
          colors: ["#2563eb"],
          bar: { groupWidth: "40%" },

          chartArea: {
            left: 260,
            right: 40,
            top: 20,
            bottom: 40,
          },

          hAxis: {
            title: "Broj prisutnih",
            minValue: 0,
            format: "0",
          },

          vAxis: {
            title: "Termin",
            textStyle: {
              fontSize: 12,
            },
          },
        }}
      />
    </div>
  );
};

export default ProfessorAttendanceChart;