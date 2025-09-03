import { UseSubmissionStore } from "../store/UseSubmissionStore";
import { UseTaskStore } from "../store/UseTaskStore";
import Submit from "./Submit";

function Controller({ task }) {
  const { isLoading, deleteTask } = UseTaskStore();
  const { isSubLoading, cancelTask } = UseSubmissionStore();
  return (
    <div>
    <div className="modal-action w-full">
      <form method="dialog" className="w-full flex justify-between">
        <button
          className="btn bg-emerald-500"
          onClick={() => document.getElementById(`my_modal_complete`).showModal()}
        >
          Complete
        </button>
        <button
          disabled={isSubLoading}
          className="btn bg-warning"
          onClick={() => cancelTask(task._id)}
        >
          {isSubLoading ? "Canceling" : "Cancel"}
        </button>
        <button
          disabled={isLoading}
          className="btn bg-red-500"
          onClick={() => deleteTask(task._id)}
        >
          {isLoading ? "Deleting" : "Delete"}
        </button>
        <button className="btn">Close</button>
      </form>
    </div>
    <dialog id={`my_modal_complete`} className="modal">
          <div className="modal-box">
            <Submit task={task}/>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
    </div>
  );
}

export default Controller;
