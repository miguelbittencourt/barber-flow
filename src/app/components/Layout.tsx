import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Main content */}
      <main className="flex-1 pb-16 overflow-y-auto">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
