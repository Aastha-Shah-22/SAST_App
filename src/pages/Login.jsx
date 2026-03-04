import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// 1. Added missing imports for Google Login and JWT decoding
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; 

function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('client');
  const [email, setEmail] = useState('client@acme.io');
  const [password, setPassword] = useState('••••••••');
  const navigate = useNavigate();

  // 2. Removed the bare `Maps("/overview");` from here.

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(selectedRole); 
    // Navigate ONLY after successful form submission
    navigate("/overview"); 
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);
    console.log("Google User:", decoded);

    try {
      await fetch("http://localhost:8080/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token
        })
      });

      // For now always login as client
      if (onLogin) onLogin("client");
      // Navigate after successful Google login
      navigate("/overview");

    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <div className="min-h-screen bg-[#070b12] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ 
          backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      <div className="w-full max-w-[560px] z-10 flex flex-col items-center gap-12">
        
        {/* Header / Logo */}
        <div className="text-center flex flex-col items-center gap-2">
          <h1 className="text-[40px] font-bold text-white tracking-wide flex items-center">
             Vumas
          </h1>
          <p className="text-[#6b7280] text-xs font-mono uppercase tracking-[0.25em]">
            Security Management Platform
          </p>
        </div>

        {/* Role Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* Client Card */}
          <div 
            onClick={() => setSelectedRole('client')}
            className={`cursor-pointer rounded-xl p-6 sm:p-8 transition-all duration-200 border relative flex flex-col ${
              selectedRole === 'client' 
                ? 'bg-[#0f151c] border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.08)]' 
                : 'bg-[#11161d] border-[#1f2937] hover:bg-[#161c24]'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#1a2332] flex items-center justify-center mb-5">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
               </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Client</h3>
            <p className="text-[#8b949e] text-[13px] font-mono leading-relaxed">
              Submit targets, review findings & manage remediation
            </p>
          </div>

          {/* Tester Card */}
          <div 
            onClick={() => setSelectedRole('tester')}
            className={`cursor-pointer rounded-xl p-6 sm:p-8 transition-all duration-200 border relative flex flex-col ${
              selectedRole === 'tester' 
                ? 'bg-[#0f151c] border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.08)]' 
                : 'bg-[#11161d] border-[#1f2937] hover:bg-[#161c24]'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#1a2332] flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18h8"></path>
                <path d="M3 22h18"></path>
                <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
                <path d="M9 14h2"></path>
                <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path>
                <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Tester</h3>
            <p className="text-[#8b949e] text-[13px] font-mono leading-relaxed">
              Run scans, verify findings & manage the test queue
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-[#6b7280] text-[11px] font-mono uppercase tracking-wider">
              Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-[#0b1016] border border-[#1f2937] text-white font-mono text-sm rounded-lg py-3.5 px-4 w-full focus:outline-none focus:border-[#00e5ff] transition-colors"
              required 
            />
          </div>
          
          <div className="flex flex-col gap-2.5">
            <label className="text-[#6b7280] text-[11px] font-mono uppercase tracking-wider">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-[#0b1016] border border-[#1f2937] text-white font-mono text-sm rounded-lg py-3.5 px-4 w-full focus:outline-none focus:border-[#00e5ff] tracking-widest transition-colors"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#00e5ff] hover:bg-[#00cce6] text-[#070b12] font-bold text-[16px] rounded-lg py-3.5 px-4 mt-2 flex items-center justify-center gap-2 transition-colors duration-200"
          >
            Sign In &rarr;
          </button>

          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

        </form>

      </div>
    </div>
  );
}

export default Login;