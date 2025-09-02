import { Calendar, ClipboardList, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { UseTaskStore } from "../store/UseTaskStore";

function Tasks() {
  const [form, setForm] = useState({
    title: "",
    type: "general",
    startAt: "",
    endAt: "",
    targetLocation: {
      lat: "",
      lng: "",
      radiusMeters: 100,
    },
  });

  const { addTask, isLoading } = UseTaskStore();

  useEffect(() => {
    if (form.type === "travel" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            targetLocation: {
              ...prev.targetLocation,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          }));
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, [form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["lat", "lng", "radiusMeters"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        targetLocation: { ...prev.targetLocation, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTask({
      ...form,
      targetLocation: {
        lat: parseFloat(form.targetLocation.lat),
        lng: parseFloat(form.targetLocation.lng),
        radiusMeters: parseInt(form.targetLocation.radiusMeters, 10),
      },
    });

    setForm({
      targetLocation: {
        lat: "",
        lng: "",
        radiusMeters: 100,
      },
      title: "",
      type: "general",
      startAt: "",
      endAt: "",
    });
  };

  return (
    <div className="p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white border rounded-xl shadow-lg p-6 space-y-5"
      >
        <div className="flex items-center gap-2 border-b pb-3 mb-3">
          <ClipboardList className="text-blue-600" size={28} />
          <h2 className="text-2xl font-semibold text-gray-800">Add New Task</h2>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Task Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Task Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="travel">Travel</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start Date & Time
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
              <Calendar className="text-gray-500 mr-2" size={18} />
              <input
                type="datetime-local"
                name="startAt"
                value={form.startAt}
                onChange={handleChange}
                className="w-full py-2 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End Date & Time
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3">
              <Calendar className="text-gray-500 mr-2" size={18} />
              <input
                type="datetime-local"
                name="endAt"
                value={form.endAt}
                onChange={handleChange}
                className="w-full py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {form.type === "travel" && (
          <div className="space-y-2">
            <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
              <MapPin className="text-red-500" size={18} />
              Task Location
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="number"
                step="any"
                name="lat"
                value={form.targetLocation.lat}
                onChange={handleChange}
                placeholder="Latitude"
                disabled={form.type === "travel"}
                className={`w-full border px-3 py-2 rounded-lg ${
                  form.type === "travel" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <input
                type="number"
                step="any"
                name="lng"
                value={form.targetLocation.lng}
                onChange={handleChange}
                placeholder="Longitude"
                disabled={form.type === "travel"}
                className={`w-full border px-3 py-2 rounded-lg ${
                  form.type === "travel" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <input
                type="number"
                name="radiusMeters"
                value={form.targetLocation.radiusMeters}
                onChange={handleChange}
                placeholder="Radius (m)"
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            {form.type === "travel" && (
              <p className="text-sm text-gray-500">
                Location auto-detected from your device.
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
        >
          {isLoading ? "Creating..." : "Create new Task"}
        </button>
      </form>
    </div>
  );
}

export default Tasks;
