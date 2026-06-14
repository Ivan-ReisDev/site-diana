import type { ReactNode } from 'react';

import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#745b58] lg:flex">
      <Sidebar />
      <main className="flex-1 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-8">{children}</div>
      </main>
    </div>
  );
}
