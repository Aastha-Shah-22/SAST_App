import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    // Basic validation
    if (!url) return alert('Please enter a Git URL');
    
    setLoading(true);
    setError(null);
    setScanData(null);

    try {
      // 1. CONNECT to your Backend API
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          repoUrl: url,
          branch: 'main' // default branch
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Scan failed');
      }

      // 2. STORE the results
      setScanData(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>🛡️ VUMAS Scanner</h1>
      
      {/* Input Section */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="https://github.com/username/repo.git" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button 
          onClick={handleScan} 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <p>🚀 Cloning repository & spinning up Docker...</p>
          <p><i>(This might take 30-60 seconds)</i></p>
        </div>
      )}

      {/* Results Section */}
      {scanData && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Scan Results</h2>
            <span style={{ 
              backgroundColor: scanData.findingsCount > 0 ? '#ffcdd2' : '#c8e6c9', 
              padding: '5px 10px', 
              borderRadius: '12px',
              fontWeight: 'bold',
              color: scanData.findingsCount > 0 ? '#b71c1c' : '#1b5e20'
            }}>
              {scanData.findingsCount} Vulnerabilities Found
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scanData.results.map((finding, index) => (
              <div key={index} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '1.5rem',
                backgroundColor: '#fff',
                textAlign: 'left'
              }}>
                <h3 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>
                  {finding.check_id}
                </h3>
                
                <p style={{ margin: '5px 0' }}>
                  <strong>📂 File:</strong> {finding.path} (Line {finding.start.line})
                </p>
                
                <p style={{ margin: '10px 0', color: '#444' }}>
                  {finding.extra.message}
                </p>

                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  overflowX: 'auto'
                }}>
                  {finding.extra.lines}
                </div>
                
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                  Severity: <strong>{finding.extra.severity}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App