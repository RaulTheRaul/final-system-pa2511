import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Test Tailwind Styles */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Vite + React + Tailwind Test
        </h1>

        {/* Test React State */}
        <div className="space-y-4">
          <p className="text-gray-700">
            Count is: <span className="font-bold text-green-600">{count}</span>
          </p>

          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Increment
          </button>
        </div>

        {/* Test Hover and Transitions */}
        <div className="mt-4">
          <div className="transform hover:scale-105 transition-transform duration-200 bg-purple-100 p-4 rounded-lg cursor-pointer">
            Hover me for animation!
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;