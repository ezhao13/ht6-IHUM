import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import logo from './logo.png';

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <div className='home-logo'>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="login-container">
        <button className="login-button" onClick={() => loginWithRedirect()}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;
