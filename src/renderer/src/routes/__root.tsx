import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => {
    return (
      <div className="w-screen h-screen flex">
        <Outlet />
      </div>
    );
  },
});
