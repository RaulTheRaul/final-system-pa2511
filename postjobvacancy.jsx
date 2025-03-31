import React, { useState } from 'react';
import axios from 'axios';

const PostVacancy = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    job_type: 'Full-time',
    description: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:8000/api/vacancies/', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Vacancy posted!');
    } catch (error) {
      console.error(error);
      alert('Error posting vacancy');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl space-y-4">
      <h1 className="text-2xl font-bold">Post a New Job</h1>

      <input type="text" name="title" placeholder="Job Title" onChange={handleChange}
        className="w-full border px-3 py-2 rounded" required />

      <input type="text" name="location" placeholder="Location" onChange={handleChange}
        className="w-full border px-3 py-2 rounded" required />

      <select name="job_type" onChange={handleChange} className="w-full border px-3 py-2 rounded">
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Casual">Casual</option>
      </select>

      <textarea name="description" placeholder="Job Description" onChange={handleChange}
        className="w-full border px-3 py-2 rounded" rows="5" required></textarea>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Post Job
      </button>
    </form>
  );
};

export default PostVacancy;
