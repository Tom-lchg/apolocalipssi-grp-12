import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import Footer from "./components/footer.tsx";
import Nav from "./components/nav.tsx";
import "./index.css";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import Summerize from "./pages/summerize.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/summerize" element={<Summerize />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
