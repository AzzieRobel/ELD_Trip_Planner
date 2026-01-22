import { useState } from "react";
import MapView from "./components/MapView";

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
    console.log("formData", formData);

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
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>ELD Trip Planner</h1>

      <input
        name="current_location"
        placeholder="Current Location"
        value={formData.current_location}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="pickup_location"
        placeholder="Pickup Location"
        value={formData.pickup_location}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="dropoff_location"
        placeholder="Dropoff Location"
        value={formData.dropoff_location}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="cycle_used_hours"
        type="number"
        placeholder="Cycle Used Hours"
        value={formData.cycle_used_hours}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Planning..." : "Plan Trip"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {route && (
        <MapView coordinates={route.geometry.coordinates} />
      )}
    </div>
  );
}

export default App;