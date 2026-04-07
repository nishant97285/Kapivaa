import { PageWrapper, FormField, SaveBtn, inputCls } from "../../components/DashComponents.jsx";

export function EditProfile() {
  return (
    <PageWrapper title="Edit Profile" subtitle="Update your personal information">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Full Name", type: "text",  val: "Vivek Ranjan" },
          { label: "Email",     type: "email", val: "vivek@example.com" },
          { label: "Phone",     type: "tel",   val: "+91 9876543210" },
          { label: "City",      type: "text",  val: "Chandigarh" },
          { label: "State",     type: "text",  val: "Punjab" },
          { label: "Pincode",   type: "text",  val: "160001" },
        ].map((f) => (
          <FormField key={f.label} label={f.label}>
            <input type={f.type} defaultValue={f.val} className={inputCls} />
          </FormField>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <SaveBtn />
      </div>
    </PageWrapper>
  );
}

export function ChangePassword() {
  return (
    <PageWrapper title="Change Password" subtitle="Keep your account secure">
      <div className="max-w-md flex flex-col gap-5">
        {["Current Password", "New Password", "Confirm New Password"].map((l) => (
          <FormField key={l} label={l}>
            <input type="password" placeholder={`Enter ${l.toLowerCase()}`} className={inputCls} />
          </FormField>
        ))}
        <SaveBtn label="Update Password" />
      </div>
    </PageWrapper>
  );
}