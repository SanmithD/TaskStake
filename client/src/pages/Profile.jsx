import { DollarSign, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import { UseAuthStore } from "../store/UseAuthStore";

function Profile() {
  const navigate = useNavigate();
  const { profile, auth, deleteAccount } = UseAuthStore();

  useEffect(() => {
    profile();
  }, []);

  const handleDelete = async () => {
    await deleteAccount(navigate);
  };

  return (
    <div className="w-full px-6 md:px-12 py-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-gray-800">
          Profile
        </h1>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-xl shadow-md p-6">
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
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>

        <div className="min-w-fit h-fit relative space-y-5 px-5 py-3 flex flex-col items-center justify-center bg-green-100 rounded-lg shadow-inner">
          <p className="flex items-center gap-2 px-2 font-medium">
            <Wallet /> Current Amount{" "}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-green-700 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            {(auth?.amount?.[0]?.amount ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
