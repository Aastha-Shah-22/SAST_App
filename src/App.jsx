import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Toast from './components/ui/Toast';
import TopNav from './components/ui/TopNav';

// Client Pages
import ClientOverview from './components/client/ClientOverview';
import SubmitTarget from './pages/SubmitTarget';
import Findings from './pages/Findings';
import Reports from './pages/Reports';

// Tester Pages
import TesterQueue from './components/tester/TesterQueue';
import TesterActive from './components/tester/TesterActive';
import TesterReview from './components/tester/TesterReview';
import TesterFindings from './components/tester/TesterFindings';

import './App.css';
 
function App() {
  const [role, setRole] = useState(null);
  const [toast, setToast] = useState({ show: false, title: '', msg: '', type: 'success' });
 


  const showToast = (title, msg = '', type = 'success') => {
    setToast({ show: true, title, msg, type });
    setTimeout(() => setToast({ show: false, title: '', msg: '', type: 'success' }), 3500);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#070b12] text-white font-sans selection:bg-[#00e5ff] selection:text-black flex flex-col">

      
          <>
            <TopNav/>

            <main className="w-full flex-grow relative overflow-y-auto">
              <Routes>
                {/* Client Routing */}
                <>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/overview" element={<div className="dashboard active"><div className="content active"><ClientOverview /></div></div>} />
                  <Route path="/submit" element={<SubmitTarget />} />
                  <Route path="/findings" element={<Findings />} />
                  <Route path="/reports" element={<Reports />} />
                  {/* Fallback for Client */}
                  <Route path="*" element={<Navigate to="/overview" replace />} />
                </>


                {/* Tester Routing */}
                <>
                  <Route path="/queue" element={<div className="dashboard active"><TesterQueue showToast={showToast} /></div>} />
                  <Route path="/active" element={<div className="dashboard active"><TesterActive /></div>} />
                  <Route path="/review" element={<div className="dashboard active"><TesterReview showToast={showToast} /></div>} />
                  <Route path="/tester-findings" element={<div className="dashboard active"><TesterFindings showToast={showToast} /></div>} />
                  {/* Fallback for Tester */}
                  <Route path="*" element={<Navigate to="/queue" replace />} />
                </>

              </Routes>
            </main>
          </>
      

        <Toast toast={toast} />
      </div>
    </Router>
  );
}

export default App;