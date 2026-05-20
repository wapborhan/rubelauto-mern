import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// ✅ PrimeReact theme and icons
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";

// ✅ Global styles
import "./index.css";

// ✅ State management
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

// ✅ Routing
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Routes";

// ✅ App providers
import { PrimeReactProvider } from "primereact/api";
import AuthProvider from "./provider/AuthProvider";

// ✅ App utilities
import Loading from "./components/shared/Loading";
import Tailwind from "primereact/passthrough/tailwind";

const RootApp = () => {
  return (
    <PrimeReactProvider value={{ pt: Tailwind }}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <AuthProvider>
            <RouterProvider router={routes} />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </PrimeReactProvider>
  );
};

// ✅ App rendering
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
