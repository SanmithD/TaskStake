import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import TaskList from "../components/TaskList";
import { UseAuthStore } from "../store/UseAuthStore";
import { UseFundStore } from "../store/UseFundStore";

function Profile() {
  const navigate = useNavigate();
  const [wdAmount, setWdAmount] = useState("");
  const { profile, auth, deleteAccount, isLoading, logout } = UseAuthStore();
  const { isFundLoading, withdrawAmount, capital, getFund } = UseFundStore();

  useEffect(() => {
    if (!auth) {
      profile();
    }
  }, []);

  useEffect(() => {
    if (auth) {
      getFund();
    }
  }, []);

  const formatted = capital?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const handleDelete = async () => {
    await deleteAccount(navigate);
  };

  const handleLogout = async () => {
    await logout(navigate);
  };

  const handleWithdraw = async () => {
    if (!wdAmount || Number(wdAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    await withdrawAmount(Number(wdAmount));
    setWdAmount("");
    document.getElementById("my_modal_withdraw").close();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full md:px-12 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-gray-800">
          Profile
        </h1>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-xl shadow-md md:p-6">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {auth?.profile?.name}
          </h2>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            {auth?.profile?.email}
          </p>
          <p className="text-sm text-gray-500">
            Joined {new Date(auth?.profile?.createdAt).toLocaleDateString()}
          </p>
          <div className="flex gap-2">
            <button
              className="btn bg-blue-500 border-0"
              onClick={() =>
                document.getElementById("my_modal_update").showModal()
              }
            >
              Edit
            </button>
            <dialog id="my_modal_update" className="modal">
              <div className="modal-box">
                <EditProfile data={auth?.profile || { name: "", email: "" }} />
                <div className="modal-action">
                  <form method="dialog" className="space-x-1">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>

            <button
              className="btn bg-red-500 border-0"
              onClick={() =>
                document.getElementById("my_modal_delete").showModal()
              }
            >
              Delete
            </button>
            <dialog id="my_modal_delete" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg text-white">Are sure!</h3>
                <div className="modal-action">
                  <form method="dialog" className="space-x-1">
                    <button className="btn">Close</button>
                    <button onClick={handleDelete} className="btn bg-red-500">
                      {isLoading ? "Deleting" : "Delete"}
                    </button>
                  </form>
                </div>
              </div>
            </dialog>

            <button
              className="btn bg-yellow-500 border-0"
              onClick={() =>
                document.getElementById("my_modal_logout").showModal()
              }
            >
              Logout
            </button>
            <dialog id="my_modal_logout" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg text-white">Are sure!</h3>
                <div className="modal-action">
                  <form method="dialog" className="space-x-1">
                    <button className="btn">Close</button>
                    <button
                      onClick={handleLogout}
                      className="btn bg-yellow-500"
                    >
                      {isLoading ? "Loading..." : "Logout"}
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>

        <div className="min-w-fit h-fit relative space-y-2 flex flex-col items-center justify-center shadow-inner">
          <div className="w-full h-full bg-green-100 px-5 py-3 rounded-lg space-y-3">
            <p className="flex items-center gap-2 px-2 font-medium">
              <Wallet /> Current Amount{" "}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-green-700 flex justify-center items-center gap-2">
              {formatted}
            </p>
          </div>
          <button
            onClick={() =>
              document.getElementById("my_modal_withdraw").showModal()
            }
            className="btn border-0 px-4 py-1.5 bg-green-300 rounded-lg text-2xl shadow-inner text-black font-medium"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="w-full mb-6">
        <TaskList />
      </div>

      <dialog id="my_modal_withdraw" className="modal text-white">
        <div className="modal-box space-y-2 ">
          <p className="text-2xl font-medium">Amount</p>
          <input
            type="number"
            className="w-full py-2 pl-2 outline-0 border-1 rounded-md"
            placeholder="Enter amount"
            value={wdAmount}
            onChange={(e) => setWdAmount(e.target.value)}
          />
          <div className="modal-action">
            <button
              className="btn bg-green-500"
              onClick={handleWithdraw}
              disabled={isFundLoading}
            >
              {isFundLoading ? "Loading..." : "Withdraw"}
            </button>
            <button
              className="btn"
              onClick={() =>
                document.getElementById("my_modal_withdraw").close()
              }
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Profile;
