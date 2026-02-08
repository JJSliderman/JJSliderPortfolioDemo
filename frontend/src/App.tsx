import { Route, Routes, useNavigate } from "react-router-dom";
import { Banner } from "./components/Banner";
import { AnswersComponent } from "./components/AnswersComponent";
import { TemplateComponent } from "./components/TemplateComponent";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginRepeat } from "./components/LoginRepeat";
import { BackToDashboard } from "./components/BackToDashboard";

//npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons to install FontAwesome //
export const App = () => {
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const path = window.location.pathname.split("/")[1];
  const locations = ["dashboard", "route-one", "route-two"];

  useEffect(() => {
    if (!locations.includes(path)) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-3">
        <Banner />
        <Routes>
          <Route path="/dashboard" element={<LoginRepeat />} />
          <Route path="/route-two" element={<AnswersComponent />} />
          <Route path="/route-one" element={<TemplateComponent />} />
          <Route path="*" element={<BackToDashboard />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
};
