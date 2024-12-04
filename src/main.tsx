import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import About from "./pages/About";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAppSelector } from "./hooks/redux";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Confirmation from "./pages/auth/Confirmation";
import Landing from "./pages/Landing";
import ResetPassword from "./pages/auth/ResetPassword";
import {
  useLazyMeQuery,
} from "./redux/features/auth/authApi";
import config from "./config";
import Transfer from "./pages/Transfer";
import Dashboard from "./pages/Dashboard";


const ProtectedRoutes = () => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Redirect to login page if there's no user, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

function App() {

  const theme = useAppSelector((state) => state.theme.theme);
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  const [getCurrentUserInfo] = useLazyMeQuery();


  useEffect(() => {
    // Apply the 'dark' class to the HTML element if the theme is 'dark'
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const getUserInfo = async () => {
    await getCurrentUserInfo();

  };

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      if (!user?.id) return;

      ws = new WebSocket(`${config.WS_USER_URL}/${user.id}`);

      ws.onopen = () => {
        console.log("WebSocket Connected");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle incoming messages here
        switch (data.type) {
          case "transfer_status":
            console.log(data);
            break;
        }
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        ws?.close();
      };
    };

    if (token && user?.id) {
      getUserInfo();
      connectWebSocket();
    }

    // Cleanup function
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [token, user?.id]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log("refresh token interval");
  //     if (user) {
  //       console.log("inside if statement refresh token");
  //       refreshToken().unwrap().catch(() => {
  //         navigate("/login");
  //       });
  //     }
  //   }, 300 * 1000);
  //   return () => clearInterval(intervalId);
  // }, [user]);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/transfer" element={<Transfer />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route element={<ProtectedRoutes />}>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/confirmation/:token" element={<Confirmation />}></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        ></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
