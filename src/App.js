import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import ManagerLayout from './layouts/ManagerLayout';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import UploadGcode from './pages/Test';

const App = () => {
  return (
    <Router basename="/3dprintClient">
      <Routes>
        <Route path="/test" element={<UploadGcode />} />
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
