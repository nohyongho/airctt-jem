import React from 'react';

export const metadata = {
  title: 'CTT CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div id="crm-root">{children}</div>
      </body>
    </html>
  );
}
