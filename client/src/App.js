import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import InputForm from './components/InputForm';
import Results from './components/Results';

// --- 1. LIVE DASHBOARD COMPONENT ---
const Dashboard = () => {
  const [tdsData, setTdsData] = useState([]);
  const [turbidityData, setTurbidityData] = useState([]);
  const [times, setTimes] = useState([]);
  const [prediction, setPrediction] = useState("Analyzing...");

  useEffect(() => {
    const fetchData = () => {
      // Connects to your Flask server on port 5001
      fetch('http://127.0.0.1:5001/live-status') 
        .then(res => res.json())
        .then(data => {
          const now = new Date().toLocaleTimeString();
          
          // Update graph data (keeping last 15 points)
          setTdsData(prev => [...prev.slice(-14), data.tds]);
          setTurbidityData(prev => [...prev.slice(-14), data.turbidity]);
          setTimes(prev => [...prev.slice(-14), now]);
          
          // Update the prediction status from the backend
          setPrediction(data.prediction); 
        })
        .catch(err => console.error("Flask server (app.py) not detected on port 5001", err));
    };

    const interval = setInterval(fetchData, 2000); // Fetch every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Helper to generate chart configurations
  const chartOptions = (title, color) => ({
    chart: { 
      id: 'live-water-graph', 
      animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } },
      toolbar: { show: false }
    },
    xaxis: { categories: times, labels: { show: false } },
    stroke: { curve: 'smooth', width: 3 },
    colors: [color],
    title: { text: title, style: { color: '#fff', fontSize: '16px' } },
    theme: { mode: 'dark' },
    grid: { borderColor: '#334155' },
    tooltip: { theme: 'dark' }
  });

  return (
    <div>
      {/* Prediction Status Card */}
      <div style={{ 
        background: prediction === "Potable" ? "#065f46" : "#7f1d1d", 
        padding: '25px', 
        borderRadius: '15px', 
        textAlign: 'center', 
        marginBottom: '25px',
        border: '3px solid ' + (prediction === "Potable" ? "#10b981" : "#ef4444"),
        transition: 'all 0.5s ease'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#fff' }}>
          Water Status: {prediction}
        </h1>
        <p style={{ margin: '10px 0 0 0', color: '#94a3b8', fontSize: '1.1rem' }}>
          Real-time AI Model Prediction
        </p>
      </div>

      {/* Live Sensor Graphs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
          <Chart options={chartOptions("TDS (ppm)", "#06b6d4")} series={[{ name: 'TDS', data: tdsData }]} type="line" height="300" />
        </div>
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
          <Chart options={chartOptions("Turbidity (NTU)", "#10b981")} series={[{ name: 'Turbidity', data: turbidityData }]} type="line" height="300" />
        </div>
      </div>
    </div>
  );
};

// --- 2. MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh', padding: '20px', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '2rem', height: '2rem', background: '#06b6d4', borderRadius: '50%' }}></div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>PureCheck AI</h1>
          </div>
          
          <nav>
            <Link to="/" style={{ color: '#06b6d4', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Live Sensors</Link>
            <Link to="/manual" style={{ color: '#94a3b8', textDecoration: 'none' }}>Manual Assessment</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/manual" element={<InputForm />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;