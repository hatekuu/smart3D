import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import ManagerLayout from './layouts/ManagerLayout';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import GCodeDiffViewer from './pages/testfile/GCodeDiffViewer';
import STLAnalyzer from './pages/testfile/STLAnalyzer';
const App = () => {
  return (
    <Router basename="/smart3D">
      <Routes>
        <Route path="/test" element={<STLAnalyzer />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products/*" element={<UserLayout />} />
        <Route path="/manager/*" element={<ManagerLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
