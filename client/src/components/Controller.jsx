import { useState } from "react";
import { UseSubmissionStore } from "../store/UseSubmissionStore";
import { UseTaskStore } from "../store/UseTaskStore";
import Submit from "./Submit";

function Controller({ task }) {
  const [isSubmit, setIsSubmit] = useState(false);
  const { isLoading, deleteTask } = UseTaskStore();
  const { isSubLoading, cancelTask } = UseSubmissionStore();

  return (
    <div>
      {/* Action buttons */}
      <div className="modal-action w-full">
        <form method="dialog" className="w-full flex flex-wrap gap-3 justify-between">
          {task.status !== "completed" && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={() => setIsSubmit(true)}
              >
                Complete
              </button>
              <button
                type="button"
                disabled={isSubLoading}
                className="btn bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                onClick={() => cancelTask(task._id)}
              >
                {isSubLoading ? "Canceling..." : "Quit"}
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              onClick={() => deleteTask(task._id)}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
            <button className="btn">Close</button>
          </div>
        </form>
      </div>

      {/* Submit Modal */}
      {isSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <button
              onClick={() => setIsSubmit(false)}
              className="btn btn-sm absolute top-3 right-3 bg-gray-200 hover:bg-gray-300"
            >
              ✕
            </button>
            <Submit task={task} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Controller;
