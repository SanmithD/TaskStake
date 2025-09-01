import { useEffect, useState } from "react";
import { UseAuthStore } from "../store/UseAuthStore";

function EditProfile({data}) {
  const { isLoading, updateProfile } = UseAuthStore();
  const [updateData, setUpdateData] = useState({ name: "", email: "" });

useEffect(() => {
  if (data) {
    setUpdateData({
      name: data.name || "",
      email: data.email || ""
    });
  }
}, [data]);


  const handleChange = (e) =>{
    const { name, value } = e.target;
    setUpdateData({
      ...updateData, [name] : value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    await updateProfile(updateData)
  }
  return (
    <div className="text-white" >
      <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={updateData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={updateData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button className="btn bg-blue-500" type="submit" >{ isLoading ? 'Updating...' : 'Update' } </button>
        </form>
    </div>
  )
}

export default EditProfile