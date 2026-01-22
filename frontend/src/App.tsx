import { useState } from "react";

type TripFormData = {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  cycle_used_hours: number | "";
};

type ApiResponse = {
  route: unknown;
  timeline: unknown[];
  daily_logs: unknown[];
};

function App() {
  const [formData, setFormData] = useState<TripFormData>({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    cycle_used_hours: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cycle_used_hours" ? Number(value) || "" : value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/plan-trip/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    );

    const data: ApiResponse = await response.json();
    console.log("API RESPONSE:", data);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px" }}>
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

      <button onClick={handleSubmit}>Plan Trip</button>
    </div>
  );
}

export default App;
