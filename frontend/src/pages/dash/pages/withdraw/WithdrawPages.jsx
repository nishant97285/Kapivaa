import { PageWrapper, DataTable, Td, FormField, SaveBtn, inputCls, statusStyle } from "../../components/DashComponents.jsx";

// In real app — fetch from GET /api/user/withdrawals
const withdrawHistory = [
  { date: "15 Mar 2026", amount: "₹5,000", method: "Bank Transfer", txn: "TXN001234", status: "Paid" },
  { date: "01 Mar 2026", amount: "₹8,000", method: "UPI",           txn: "TXN001100", status: "Paid" },
  { date: "15 Feb 2026", amount: "₹3,500", method: "Bank Transfer", txn: "TXN000987", status: "Paid" },
  { date: "01 Feb 2026", amount: "₹7,800", method: "Bank Transfer", txn: "TXN000876", status: "Processing" },
];

export function Withdrawal() {
  return (
    <PageWrapper title="Withdrawal Request" subtitle="Request a payout to your bank account">
      {/* Balance Summary */}
      <div className="grid grid-cols-2 gap-4 mb-7 max-w-md">
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-emerald-600">₹9,470</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Total Withdrawn</p>
          <p className="text-2xl font-bold text-orange-500">₹24,300</p>
        </div>
      </div>

      <div className="max-w-md flex flex-col gap-5">
        <FormField label="Withdrawal Amount (₹)">
          <input type="number" placeholder="Enter amount" min="500" className={inputCls} />
        </FormField>
        <FormField label="Bank Account Number">
          <input type="text" placeholder="Enter account number" className={inputCls} />
        </FormField>
        <FormField label="IFSC Code">
          <input type="text" placeholder="Enter IFSC code" className={inputCls} />
        </FormField>
        <FormField label="UPI ID (optional)">
          <input type="text" placeholder="yourname@upi" className={inputCls} />
        </FormField>
        <SaveBtn label="Submit Request" />
      </div>
    </PageWrapper>
  );
}

export function WithdrawalHistory() {
  return (
    <PageWrapper title="Withdrawal History" subtitle="All withdrawal transactions">
      <DataTable
        cols={["Date", "Amount", "Method", "Transaction ID", "Status"]}
        rows={withdrawHistory.map((r, i) => (
          <tr key={i} className="hover:bg-slate-50">
            <Td>{r.date}</Td>
            <Td><span className="font-semibold text-orange-500">{r.amount}</span></Td>
            <Td>{r.method}</Td>
            <Td><span className="font-mono text-xs text-slate-500">{r.txn}</span></Td>
            <Td>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                {r.status}
              </span>
            </Td>
          </tr>
        ))}
      />
    </PageWrapper>
  );
}