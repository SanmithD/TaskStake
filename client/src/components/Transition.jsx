import { useEffect, useState } from "react";
import { UseFundStore } from "../store/UseFundStore";

function Transition() {
  const [tab, setTab] = useState("added");
  const { funds, getRecentFund, getWithdrawFund, withdraw } = UseFundStore();

  useEffect(() => {
    getRecentFund();
    getWithdrawFund();
  }, []);

  const sortedRecent =
    funds?.recentAdded?.slice().sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

  const sortedWithdraw =
    withdraw?.[0]?.recentWithdrawals
      ?.slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

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

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("added")}
          className={`px-4 py-2 cursor-pointer rounded-md ${
            tab === "added" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          Added
        </button>
        <button
          onClick={() => setTab("withdraw")}
          className={`px-4 py-2 cursor-pointer rounded-md ${
            tab === "withdraw" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          Withdraw
        </button>
      </div>

      {tab === "added" && (
        <>
          {sortedRecent.length > 0 ? (
            <ul className="space-y-3 h-[70%] overflow-y-scroll">
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
            <p className="text-gray-500 text-center">No recent deposits</p>
          )}
        </>
      )}

      {tab === "withdraw" && (
        <>
          {sortedWithdraw.length > 0 ? (
            <ul className="space-y-3 h-[70%] overflow-y-scroll">
              {sortedWithdraw.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0"
                >
                  <span className="text-red-600 font-medium">
                    - {item.cash.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No withdrawals yet</p>
          )}
        </>
      )}
    </div>
  );
}

export default Transition;
