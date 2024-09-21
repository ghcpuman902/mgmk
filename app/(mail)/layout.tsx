import React from 'react';

interface MailLayoutProps {
  children: React.ReactNode;
}

export default async function MailLayout({ children }: MailLayoutProps) {
  return (
    <div className="mx-auto mt-44 mb-8 px-8">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
