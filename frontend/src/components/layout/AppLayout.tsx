import type { ReactNode } from 'react';

interface AppLayoutProps {
  chatBar: ReactNode;
  content: ReactNode;
  toast?: ReactNode;
}

export function AppLayout({ chatBar, content, toast }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <header className="w-full max-w-5xl mx-auto">
        {chatBar}
      </header>
      <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto overflow-y-auto">
        {content}
      </main>
      {toast}
    </div>
  );
}
