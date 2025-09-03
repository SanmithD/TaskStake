import { useEffect, useState } from "react";
import { UseSubmissionStore } from "../store/UseSubmissionStore";

function Submit({ task }) {
  const [geo, setGeo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const { isSubLoading, submitTask } = UseSubmissionStore();

  useEffect(() => {
    if (task?.type === "travel" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeo({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, [task?.type]);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("kind", task?.type);

  if (geo) {
    formData.append("geo", JSON.stringify(geo));
  }
  if (photo) {
    formData.append("photo", photo); // This should be the File object
  }
  if (file) {
    formData.append("file", file); // This should be the File object
  }
  formData.append("ai", ""); // Use empty string instead of null

  await submitTask(task._id, formData);
};


  return (
    <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto border border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Submit Your Task Proof
      </h2>

      {task.type === "travel" && (
        <div className="mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm">
          {geo ? (
            <p>
              📍 Location captured:{" "}
              <span className="font-mono">
                {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}
              </span>
            </p>
          ) : (
            <p className="text-gray-400">Capturing your location...</p>
          )}
        </div>
      )}

      {task.type === "general" && (
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-medium
                         file:bg-blue-600 file:text-white
                         hover:file:bg-blue-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-medium
                         file:bg-blue-600 file:text-white
                         hover:file:bg-blue-700"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   rounded-xl px-4 py-3 font-semibold text-lg"
      >
        {isSubLoading ? "Submitting..." : "Submit Task"}
      </button>
    </div>
  );
}

export default Submit;
