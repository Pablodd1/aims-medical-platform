import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vodhhauwowkalvaxzqyv.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [status, setStatus] = useState('connecting');
  const [dbStatus, setDbStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
          setStatus('warning');
          setDbStatus('Supabase key not configured - set REACT_APP_SUPABASE_ANON_KEY');
          return;
        }
        
        const { data, error } = await supabase.from('pg_tables').select('tablename').limit(1);
        if (error) {
          setStatus('error');
          setError(error.message);
        } else {
          setStatus('connected');
          setDbStatus('Supabase connected - ' + (data?.length || 0) + ' tables accessible');
        }
      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    }
    checkConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>AIMS Medical Assessment Platform</h1>
        <p>MSK Assessment with Anti-Hallucination RAG</p>
        <p className="status-url">Supabase: {supabaseUrl}</p>
      </header>

      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="status-card">
          <h2>Platform Status</h2>
          <div className={`status-indicator status-${status}`}>
            {status === 'connecting' && <span className="spinner"></span>}
            <p>
              {status === 'connected' && '✅ Supabase Connected'}
              {status === 'connecting' && '⏳ Connecting to Supabase...'}
              {status === 'warning' && '⚠️ ' + dbStatus}
              {status === 'error' && '❌ Error: ' + error}
            </p>
            {dbStatus && status !== 'warning' && <p className="db-info">{dbStatus}</p>}
          </div>
        </div>

        <div className="platform-info">
          <h3>Platform Features</h3>
          <ul>
            <li>Multi-Agent MSK Specialist Swarm</li>
            <li>Anti-Hallucination RAG Pipeline</li>
            <li>Movement Vector Analysis</li>
            <li>Patient Assessment Workflows</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
