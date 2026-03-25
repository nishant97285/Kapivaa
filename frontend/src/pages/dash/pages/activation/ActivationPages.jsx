import { PageWrapper, DataTable, Td, FormField, SaveBtn, inputCls, statusStyle } from "../../components/DashComponents.jsx";

// In real app — fetch from GET /api/user/activations
const activationHistory = [
  { id: "KP1001", name: "Rahul Sharma", date: "10 Jan 2026", pkg: "Gold",     amount: "₹5,999", status: "Active" },
  { id: "KP1002", name: "Priya Mehta",  date: "15 Jan 2026", pkg: "Silver",   amount: "₹2,999", status: "Active" },
  { id: "KP1003", name: "Amit Singh",   date: "20 Jan 2026", pkg: "Basic",    amount: "₹999",   status: "Expired" },
  { id: "KP1004", name: "Sneha Patel",  date: "25 Jan 2026", pkg: "Platinum", amount: "₹9,999", status: "Active" },
];

export function ActivateId() {
  return (
    <PageWrapper title="Activate ID" subtitle="Activate a new member ID">
      <div className="max-w-md flex flex-col gap-5">
        <FormField label="Member ID">
          <input type="text" placeholder="Enter member ID to activate" className={inputCls} />
        </FormField>
        <FormField label="Package">
          <select className={inputCls}>
            <option>Basic — ₹999</option>
            <option>Silver — ₹2,999</option>
            <option>Gold — ₹5,999</option>
            <option>Platinum — ₹9,999</option>
          </select>
        </FormField>
        <FormField label="Transaction ID">
          <input type="text" placeholder="Enter payment transaction ID" className={inputCls} />
        </FormField>
        <SaveBtn label="Activate Now" />
      </div>
    </PageWrapper>
  );
}

export function ActivationHistory() {
  return (
    <PageWrapper title="Activation History" subtitle="All activation records">
      <DataTable
        cols={["ID", "Name", "Date", "Package", "Amount", "Status"]}
        rows={activationHistory.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50">
            <Td><span className="font-semibold text-orange-500">{r.id}</span></Td>
            <Td>{r.name}</Td>
            <Td>{r.date}</Td>
            <Td>{r.pkg}</Td>
            <Td><span className="font-semibold">{r.amount}</span></Td>
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