import { useState } from "react";

import MapView from "./components/MapView";
import ELDLogSheet from "./components/ELDLogSheet";

type TripFormData = {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  cycle_used_hours: number | "";
};

type RouteResponse = {
  distance_miles: number;
  duration_hours: number;
  geometry: {
    coordinates: [number, number][];
  };
};

type LogSegment = {
  start: number;
  end: number;
  status: "driving" | "on_duty" | "off_duty";
};

type DailyLog = {
  day: number;
  segments: LogSegment[];
};

function App() {
  const [formData, setFormData] = useState<TripFormData>({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    cycle_used_hours: ""
  });

  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cycle_used_hours"
          ? value === "" ? "" : Number(value)
          : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/plan-trip/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cycle_used_hours: Number(formData.cycle_used_hours)
        })
      });

      console.log('response', response);

      if (!response.ok) throw new Error("Failed to plan trip");

      const data = await response.json();
      setRoute(data.route);
      setDailyLogs(data.daily_logs);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <div style={{ padding: "2rem" }}>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">ELD Trip Planner</h1>
          <p className="text-gray-600 mb-8">
            Plan routes, stops, and ELD logs for long-haul trips
          </p>

          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <div className="space-y-4">
              <input
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="current_location"
                placeholder="Current Location"
                value={formData.current_location}
                onChange={handleChange}
              />

              <input
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="pickup_location"
                placeholder="Pickup Location"
                value={formData.pickup_location}
                onChange={handleChange}
              />

              <input
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="dropoff_location"
                placeholder="Dropoff Location"
                value={formData.dropoff_location}
                onChange={handleChange}
              />

              <input
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="cycle_used_hours"
                type="number"
                placeholder="Cycle Used Hours"
                value={formData.cycle_used_hours}
                onChange={handleChange}
              />
              <br /><br />
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={handleSubmit} disabled={loading}>
              {loading ? "Planning..." : "Plan Trip"}
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {route && (
            <div className="bg-white p-4 rounded-xl shadow mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Route Overview
              </h2>
              <MapView coordinates={route.geometry.coordinates} />
            </div>
          )}

          <br /><br />

          {dailyLogs.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Daily ELD Logs
              </h2>

              <div className="space-y-8">
                {dailyLogs.map((log) => (
                  <ELDLogSheet
                    key={log.day}
                    day={log.day}
                    segments={log.segments}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;