import { useState } from "react";
import { Link } from "react-router-dom"; 

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#f7f7f5] overflow-hidden">
      {/* Oval Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[90%] bg-[#b5c98a] rounded-b-[50%]"></div>

      {/* Form Card */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b5c98a]"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b5c98a]"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b5c98a]"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b5c98a]"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#b5c98a] text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account? <span className="text-[#b5c98a] cursor-pointer"><Link to = "/login">Login</Link></span>
        </p>
      </div>
    </div>
  );
}
