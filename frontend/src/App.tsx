import { useState } from "react";

import MapView from "./components/MapView";
import ELDLogSheet from "./components/ELDLogSheet";
import FormSection from "./components/FormSection";

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
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <div style={{ padding: "2rem" }}>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">ELD Trip Planner</h1>
          <p className="text-gray-600 mb-8">
            Plan routes, stops, and ELD logs for long-haul trips
          </p>

          <FormSection Props={{setRoute,setError, setDailyLogs}} />

          {error && <p style={{ color: "red" }}>{error}</p>}

          {route && (
            <div className="bg-white p-4 rounded-xl shadow mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Route Overview
              </h2>
              <MapView coordinates={route.geometry.coordinates} />
            </div>
          )}

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