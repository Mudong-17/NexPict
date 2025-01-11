import { createFileRoute } from "@tanstack/react-router";

const Logs = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex-1 overflow-y-auto gap-3"></div>
    </div>
  );
};

export const Route = createFileRoute("/_layout/logs/")({
  component: Logs,
});
