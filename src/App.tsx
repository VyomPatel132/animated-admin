import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { store } from "./store";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/root/ErrorBoundary";
export default function App() {
  return (
    <Provider store={store}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </MotionConfig>
    </Provider>
  );
}
