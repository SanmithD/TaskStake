import { useState } from "react";
import { UseContactStore } from "../store/UseContactStore";

function Contact() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const { isLoading, sendMail } = UseContactStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMail(formData);
    setFormData({ subject: "", message: "" });
  };

  return (
    <div className="flex w-full justify-center md:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            required
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            required
            rows="5"
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default Contact;
