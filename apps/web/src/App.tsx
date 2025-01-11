import { FluentProvider } from "@fluentui/react-components";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { DialogProvider, ToastProvider } from "./providers";
import { routeTree } from "./routeTree.gen.ts";
import { useAppStore, usePluginStore } from "./store";
import theme from "./theme";

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const fetchAppInfo = useAppStore((state) => state.fetchAppInfo);
  const fetchPlugins = usePluginStore((state) => state.fetchPlugins);
  const darkMode = useAppStore((state) => state.darkMode);

  const getBaseInfo = async () => {
    fetchAppInfo();
    fetchPlugins(true);
  };

  useEffect(() => {
    getBaseInfo();
  }, []);

  return (
    <FluentProvider theme={darkMode ? theme.darkTheme : theme.lightTheme}>
      <ToastProvider>
        <DialogProvider>
          <RouterProvider router={router} />
        </DialogProvider>
      </ToastProvider>
    </FluentProvider>
  );
};

export default App;
