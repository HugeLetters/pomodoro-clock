import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import "./index.pcss";
import "react-toastify/dist/ReactToastify.css";
import FixedButtons from "./Components/FixedButtons";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={
        <div>
          <p>Something went terribly wrong 😢</p>
          <p>Please try reloading the page and clearing browser cache for this website</p>
        </div>
      }
    >
      <ErrorBoundary
        fallback={
          <div className="fixed top-1/2 flex -translate-y-1/2 flex-col items-center justify-center">
            <p>There was an error with the app</p>
            <div>
              <span>Please try clearing your browser cache for this website:</span>
              <ul className="list-inside list-disc">
                <li>using a button at the top left</li>
                <li>manually</li>
              </ul>
            </div>
          </div>
        }
      >
        <App />
      </ErrorBoundary>
      <ToastContainer
        theme="colored"
        limit={5}
      />
      <FixedButtons />
    </ErrorBoundary>
  </React.StrictMode>
);
