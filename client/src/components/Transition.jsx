import { useEffect } from "react";
import { UseFundStore } from "../store/UseFundStore";

function Transition() {
  const { funds, getRecentFund } = UseFundStore();

  useEffect(() => {
    getRecentFund();
  }, []);

  const sortedRecent =
    funds?.recentAdded?.slice().sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen w-full max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">💰 Recent Fund Activity</h2>

      {sortedRecent.length > 0 ? (
        <ul className="space-y-3 h-screen md:h-[70%] overflow-y-scroll">
          {sortedRecent.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0"
            >
              <span className="text-green-700 font-medium">
                + {item.cash.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No recent transactions</p>
      )}
    </div>
  );
}

export default Transition;
