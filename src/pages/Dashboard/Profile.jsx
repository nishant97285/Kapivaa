import { useState } from "react";

const Profile = () => {
  const [form, setForm] = useState({
    name: "Vivek",
    email: "Vivek@gmail.com",
    phone: "9876543210",
    dob: "2002-01-15",
    gender: "Male",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Edit Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-2xl font-black text-white">
            {form.name[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{form.name}</p>
            <p className="text-xs text-gray-400">{form.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "Date of Birth", name: "dob", type: "date" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
              />
            </div>
          ))}

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Gender
            </label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  onClick={() => { setForm({ ...form, gender: g }); setSaved(false); }}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all
                    ${form.gender === g
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600 hover:border-gray-500"
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200
            ${saved
              ? "bg-green-500 text-white"
              : "bg-black text-white hover:bg-gray-800"
            }`}
        >
          {saved ? "✓ Changes Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Profile;