import React from 'react';
// import Navbar from './components/Navbar';
import Login from './components/Login';
import Headers from './components/Headers';
import AboutHum from './components/AboutHum';

import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
// import Signup from "./components/Signup";
// import VoiceRecorder from "./VoiceRecorder";

import Profile from "./Profile";
import PrivateRoute from "./PrivateRoute";
import Pricing from './components/Pricing';

function App() {
  return (
    <div className="app-container">
      {/* <Navbar /> */}
      <Headers />
      <div className="content">
        <Router>
          <Routes>
            <Route path="/" Component={Login} />
            <Route path="/pricing" Component={Pricing} />
            <Route path="/home" Component={Home} />
            <Route path="/about" Component={AboutHum} />
            <Route
              path="/profile"
              element={<PrivateRoute component={Profile} />}
            />
            {/* <Route
              path="/home"
              element={<PrivateRoute component={Home} />}
            /> */}
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;