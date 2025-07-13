import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import LiveView from "@/components/pages/LiveView";
import Incidents from "@/components/pages/Incidents";
import Analytics from "@/components/pages/Analytics";
import System from "@/components/pages/System";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LiveView />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="system" element={<System />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;