import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Orders", value: "12", icon: "📦", path: "/dashboard/orders" },
  { label: "Wishlist Items", value: "5", icon: "♡", path: "/dashboard/wishlist" },
  { label: "Kapiva Coins", value: "240", icon: "🪙", path: "/dashboard/coins" },
  { label: "Saved Addresses", value: "2", icon: "📍", path: "/dashboard/addresses" },
];

const recentOrders = [
  { id: "#KAP10234", product: "Shilajit Gold Resin 40g", date: "15 Mar 2026", status: "Delivered", price: 1312 },
  { id: "#KAP10198", product: "Testofuel Shilajit Whey Protein", date: "08 Mar 2026", status: "In Transit", price: 2899 },
  { id: "#KAP10121", product: "Shilajit Gold Capsules 60 Caps", date: "01 Mar 2026", status: "Delivered", price: 1199 },
];

const statusColor = {
  Delivered: "bg-green-100 text-green-700",
  "In Transit": "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-600",
};

const Overview = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Welcome back, Vivek 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening with your account
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            onClick={() => navigate(stat.path)}
            className="bg-white rounded-2xl p-4 border border-gray-200 cursor-pointer hover:border-green-400 hover:shadow-md transition-all duration-200 group"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition-colors">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Coins Banner */}
      <div className="bg-black rounded-2xl p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-white font-black text-lg">🪙 240 Kapiva Coins</p>
          <p className="text-gray-400 text-xs mt-1">
            Use coins to get extra discounts on your next order
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/coins")}
          className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shrink-0"
        >
          View Details
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => navigate("/dashboard/orders")}
            className="text-xs text-green-600 font-semibold hover:underline"
          >
            View all
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-green-600">{order.id}</p>
                <p className="text-sm font-medium text-gray-800 truncate">{order.product}</p>
                <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 ml-4 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
                  {order.status}
                </span>
                <span className="text-sm font-black text-gray-900">₹{order.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;