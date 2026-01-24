import { useState } from "react";

type TripFormData = {
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    cycle_used_hours: number | "";
    driver_name: string;
};

function FormSection({ Props }: any) {
    const { setRoute, setError, setDailyLogs } = Props;

    const [formData, setFormData] = useState<TripFormData>({
        current_location: "",
        pickup_location: "",
        dropoff_location: "",
        cycle_used_hours: "",
        driver_name: ""
    });

    const [loading, setLoading] = useState(false);

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
        <div className="bg-white p-6 rounded-xl shadow mb-8">
            <div className="flex gap-6 pb-8">
                {/* Left column */}
                <div className="flex-1 space-y-4">
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
                </div>

                {/* Right column */}
                <div className="flex-1">
                    <input
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="driver_name"
                        placeholder="Driver Name"
                        value={formData.driver_name}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                onClick={handleSubmit} disabled={loading}>
                {loading ? "Planning..." : "Plan Trip"}
            </button>
        </div>
    )
}

export default FormSection