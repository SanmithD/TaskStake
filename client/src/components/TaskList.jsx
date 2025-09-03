import { useEffect } from "react";
import { UseSubmissionStore } from "../store/UseSubmissionStore";
import Loader from "./Loader";

function TaskList() {
  const { getAllSubmissions, allTasks, isSubLoading } = UseSubmissionStore();

  useEffect(() => {
    getAllSubmissions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: "badge badge-success",
      rejected: "badge badge-error",
      pending: "badge badge-warning",
    };
    return statusClasses[status] || "badge badge-neutral";
  };

  const formatGainLoss = (value) => {
    if (value === null || value === undefined) return "N/A";
    const color = value >= 0 ? "text-green-600" : "text-red-600";
    const sign = value >= 0 ? "+" : "";
    return (
      <span className={color}>
        {sign}
        {value.toFixed(2)}
      </span>
    );
  };

  return (
    <div className="container">
      <div className="card bg-white border border-gray-300 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4 text-gray-800">
            📋 All Submissions
          </h2>

          {isSubLoading ? (
            <Loader />
          ) : allTasks && allTasks.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="text-left">Task Title</th>
                      <th className="text-left">Type</th>
                      <th className="text-center">Status</th>
                      <th className="text-left">Reason</th>
                      <th className="text-right">Gain/Loss</th>
                      <th className="text-left">Created At</th>
                      <th className="text-left">Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTasks.map((submission) => (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="font-semibold text-gray-800">
                          {submission.taskId?.title || "Unknown Task"}
                        </td>

                        <td>
                          <span className="badge badge-outline text-gray-700">
                            {submission.kind}
                          </span>
                        </td>

                        <td className="text-center">
                          <span className={getStatusBadge(submission.status)}>
                            {submission.status}
                          </span>
                        </td>

                        <td className="max-w-xs text-gray-600">
                          <div className="truncate">
                            {submission.reason || "No reason provided"}
                          </div>
                        </td>

                        <td className="text-right font-semibold">
                          {formatGainLoss(submission.gainLoss)}
                        </td>

                        <td className="text-sm text-gray-600">
                          {formatDate(submission.createdAt)}
                        </td>

                        <td className="text-sm text-gray-600">
                          {formatDate(submission.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Total submissions: {allTasks.length}
                </div>
                <div className="flex gap-2">
                  <div className="badge badge-success badge-sm">Approved</div>
                  <div className="badge badge-error badge-sm">Rejected</div>
                  <div className="badge badge-warning badge-sm">Pending</div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                No Submissions Found
              </h3>
              <p className="text-gray-500">
                When submissions are created, they will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
