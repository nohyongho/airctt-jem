import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 260, borderRight: '1px solid #eee', padding: 16 }}>CRM Sidebar</aside>
      <section style={{ flex: 1, padding: 20 }}>{children}</section>
    </div>
  );
}
