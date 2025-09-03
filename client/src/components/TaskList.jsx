import { useEffect } from "react";
import { UseSubmissionStore } from "../store/UseSubmissionStore";

function TaskList() {
    const { getAllSubmissions } = UseSubmissionStore();

    useEffect(()=>{
        getAllSubmissions();
    },[]);
  return (
    <div>TaskList</div>
  )
}

export default TaskList