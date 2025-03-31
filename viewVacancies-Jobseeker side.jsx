import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/vacancies/')
      .then(response => setVacancies(response.data))
      .catch(error => console.error('Error fetching vacancies:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Available Vacancies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vacancies.map(vacancy => (
          <div key={vacancy.id} className="bg-white shadow rounded-xl p-4">
            <h2 className="text-xl font-semibold">{vacancy.title}</h2>
            <p className="text-gray-600">{vacancy.location} • {vacancy.job_type}</p>
            <p className="mt-2 text-gray-700">{vacancy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vacancies;
