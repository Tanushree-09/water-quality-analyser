import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [tdsData, setTdsData] = useState([]);
  const [turbidityData, setTurbidityData] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      // Fetches live hardware data from your Flask server
      fetch('http://127.0.0.1:5001/live-status') 
        .then(res => res.json())
        .then(data => {
          const now = new Date().toLocaleTimeString();
          // Keeps the graphs moving with the latest 15 readings
          setTdsData(prev => [...prev.slice(-14), data.tds]);
          setTurbidityData(prev => [...prev.slice(-14), data.turbidity]);
          setTimes(prev => [...prev.slice(-14), now]);
        })
        .catch(err => console.error("Is app.py running on port 5001?", err));
    };

    const interval = setInterval(fetchData, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const chartOptions = (title, color) => ({
    chart: { id: 'live-water-graph', animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } } },
    xaxis: { categories: times },
    stroke: { curve: 'smooth' },
    colors: [color],
    title: { text: title, style: { color: '#fff', fontSize: '16px' } },
    theme: { mode: 'dark' },
    grid: { borderColor: '#334155' }
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
        <Chart options={chartOptions("Solids (TDS) - ppm", "#06b6d4")} series={[{ name: 'TDS', data: tdsData }]} type="line" height="300" />
      </div>
      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
        <Chart options={chartOptions("Turbidity - NTU", "#10b981")} series={[{ name: 'Turbidity', data: turbidityData }]} type="line" height="300" />
      </div>
    </div>
  );
};

export default Dashboard;