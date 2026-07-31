import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <AdminSidebar />

      <main
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        {children}
      </main>
    </div>
  );
}