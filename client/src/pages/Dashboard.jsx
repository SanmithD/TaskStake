import { Calendar, Clock, MapPin } from "lucide-react";
import { useEffect } from "react";
import EditTask from "../components/EditTask";
import { UseSubmissionStore } from "../store/UseSubmissionStore";
import { UseTaskStore } from "../store/UseTaskStore";
import Controller from '../components/Controller';

function Dashboard() {
  const { getAllTasks, allTasks } = UseTaskStore();

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {allTasks?.length === 0 ? (
        <p className="text-gray-500">No tasks available</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-[350px] md:w-full md:px-4 ">
          {allTasks?.map((task) => (
            <div
              key={task._id}
              onClick={() =>
                document.getElementById(`my_modal_${task._id}`).showModal()
              }
              className="bg-white border cursor-pointer hover:bg-amber-50 rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {task.title}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium
    ${
      task.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : task.status === "failed" || task.status === "cancelled"
        ? "bg-red-400 text-white"
        : "bg-green-100 text-green-700"
    }`}
                >
                  {task.status}
                </span>
              </div>

              <p className="text-gray-600 mb-3 capitalize">
                Type: <span className="font-medium">{task.type}</span>
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>
                    Start:{" "}
                    {new Date(task.startAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>
                    End:{" "}
                    {new Date(task.endAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              {task.targetLocation && (
                <div className="flex items-center gap-2 mt-3 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>Radius: {task.targetLocation.radiusMeters} meters</span>
                </div>
              )}
              <dialog id={`my_modal_${task._id}`} className="modal">
                <div className="modal-box">
                  <EditTask taskDetails={task} />
                  <Controller task={task._id}/>
                </div>
              </dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
