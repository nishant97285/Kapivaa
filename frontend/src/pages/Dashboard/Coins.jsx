const coinHistory = [
  { id: 1, type: "earned", label: "Order #KAP10234", coins: +66, date: "15 Mar 2026" },
  { id: 2, type: "used", label: "Order #KAP10198", coins: -50, date: "08 Mar 2026" },
  { id: 3, type: "earned", label: "Order #KAP10121", coins: +60, date: "01 Mar 2026" },
  { id: 4, type: "earned", label: "Referral Bonus", coins: +100, date: "18 Feb 2026" },
  { id: 5, type: "used", label: "Order #KAP10045", coins: -25, date: "05 Feb 2026" },
];

const Coins = () => {
  const total = coinHistory.reduce((sum, c) => sum + c.coins, 0) + 89; // base

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Kapiva Coins</h1>

      {/* Balance Card */}
      <div className="bg-black rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-green-500/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full bg-green-500/5 pointer-events-none" />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Total Balance</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-white">{total}</span>
          <span className="text-green-400 font-bold text-lg mb-1">Coins</span>
        </div>
        <p className="text-gray-400 text-xs mt-2">≈ ₹{total} discount on your next order</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: "🛒", title: "Buy Products", desc: "Earn 5% coins on every order" },
          { icon: "🪙", title: "Accumulate", desc: "Coins never expire" },
          { icon: "💰", title: "Redeem", desc: "Use coins as discount at checkout" },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-xs font-bold text-gray-900">{item.title}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {coinHistory.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">{tx.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
              </div>
              <span className={`text-base font-black ${tx.coins > 0 ? "text-green-500" : "text-red-500"}`}>
                {tx.coins > 0 ? "+" : ""}{tx.coins} 🪙
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coins;