import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

const JobCardEditable = ({ job, refreshJobs }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: job.title,
    description: job.description,
    location: job.location,
  });

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "jobs", job.id), {
        title: form.title,
        description: form.description,
        location: form.location,
      });
      setEditing(false);
      refreshJobs(); // Refresh job list
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "jobs", job.id));
      refreshJobs(); // Refresh job list
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  return (
    <li className="bg-white p-4 rounded shadow-sm space-y-2">
      {editing ? (
        <>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border rounded p-2"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded p-2"
          />
          <div className="flex gap-3 mt-2">
            <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
            <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h4 className="text-lg font-bold">{job.title}</h4>
          <p className="text-sm text-gray-700">{job.company} • {job.location}</p>
          <pre className="text-gray-600 whitespace-pre-wrap font-sans">
            {job.description}
          </pre>

          <div className="flex gap-3 mt-2">
            <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline">Edit</button>
            <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
          </div>
        </>
      )}
    </li>
  );
};

export default JobCardEditable;
