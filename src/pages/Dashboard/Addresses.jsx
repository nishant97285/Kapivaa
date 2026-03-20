import { useState } from "react";

const initialAddresses = [
  { id: 1, label: "Home", name: "Vivek", phone: "9876543210", line1: "H.No. 123, Sector 22", city: "Chandigarh", state: "Punjab", pincode: "140119", isDefault: true },
  { id: 2, label: "Work", name: "Vivek", phone: "9876543210", line1: "Plot 45, Industrial Area Phase 1", city: "Mohali", state: "Punjab", pincode: "160055", isDefault: false },
];

const Addresses = () => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Home", name: "", phone: "", line1: "", city: "", state: "", pincode: "" });

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleSubmit = () => {
    if (!form.name || !form.line1 || !form.city || !form.pincode) return;
    setAddresses((prev) => [...prev, { ...form, id: Date.now(), isDefault: false }]);
    setForm({ label: "Home", name: "", phone: "", line1: "", city: "", state: "", pincode: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Saved Addresses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          + Add New
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <h2 className="font-bold text-gray-900 mb-4">New Address</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "name", placeholder: "Full Name" },
              { key: "phone", placeholder: "Phone Number" },
              { key: "line1", placeholder: "House / Street Address" },
              { key: "city", placeholder: "City" },
              { key: "state", placeholder: "State" },
              { key: "pincode", placeholder: "Pincode" },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="col-span-2 sm:col-span-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
              />
            ))}
            <div className="col-span-2 flex gap-2">
              {["Home", "Work", "Other"].map((l) => (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, label: l })}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors
                    ${form.label === l ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-gray-500"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} className="bg-green-500 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-green-600 transition-colors">
              Save Address
            </button>
            <button onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-600 text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address Cards */}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-white rounded-2xl border p-5 transition-all duration-200 ${addr.isDefault ? "border-green-400 shadow-sm" : "border-gray-200"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-900">{addr.name} &nbsp;·&nbsp; <span className="font-medium text-gray-500">{addr.phone}</span></p>
                <p className="text-sm text-gray-600 mt-0.5">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr.id)} className="text-xs font-bold text-green-600 border border-green-400 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors">
                  Set Default
                </button>
              )}
              <button onClick={() => handleDelete(addr.id)} className="text-xs font-bold text-red-500 border border-red-300 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;