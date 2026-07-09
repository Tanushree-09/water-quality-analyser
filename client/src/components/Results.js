import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const FEATURE_CONFIG = [
    { name: "ph", label: "pH", max: 14 },
    { name: "Hardness", label: "Hardness", max: 300 },
    { name: "Solids", label: "Solids", max: 50000 },
    { name: "Chloramines", label: "Chloramines", max: 10 },
    { name: "Sulfate", label: "Sulfate", max: 400 },
    { name: "Conductivity", label: "Conductivity", max: 600 },
    { name: "Organic_carbon", label: "Organic C", max: 20 },
    { name: "Trihalomethanes", label: "Trihal", max: 100 },
    { name: "Turbidity", label: "Turbidity", max: 5 }
];

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const inputData = location.state;

    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!inputData) {
            navigate('/');
            return;
        }

        const fetchPrediction = async () => {
            try {
                console.log("Sending request to backend...");
                const response = await axios.post('http://localhost:5001/predict', inputData);
                console.log("Response received:", response.data);
                setPredictionResult(response.data);
            } catch (error) {
                console.error("Error fetching prediction:", error);
                setPredictionResult({ error: error.message + (error.response ? ": " + JSON.stringify(error.response.data) : "") });
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [inputData, navigate]);

    if (!inputData) return null;

    // Prepare Chart Data
    const barData = FEATURE_CONFIG.map(f => ({
        name: f.label,
        value: parseFloat(inputData[f.name]),
        limit: f.max // visualizing scale
    }));

    const radarData = FEATURE_CONFIG.map(f => ({
        subject: f.label,
        A: parseFloat(inputData[f.name]),
        fullMark: f.max
    }));

    return (
        <div className="results-container">
            <motion.h2
                className="gradient-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Analysis Results
            </motion.h2>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <motion.div className="glass-panel" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <h3>Parameter Levels</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div className="glass-panel" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <h3>Water Profile (Radar)</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} />
                                <Radar name="Sample" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="glass-panel"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h3>Prediction & Explanation</h3>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading AI Analysis...</div>
                ) : predictionResult && !predictionResult.error ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                background: predictionResult.prediction === "Potable" ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                border: `1px solid ${predictionResult.prediction === "Potable" ? '#10b981' : '#ef4444'}`,
                                color: predictionResult.prediction === "Potable" ? '#34d399' : '#f87171',
                                fontWeight: 'bold',
                                fontSize: '1.5rem'
                            }}>
                                {predictionResult.prediction}
                            </div>
                            <div style={{ color: '#94a3b8' }}>
                                Confidence: {predictionResult.confidence ? predictionResult.confidence.toFixed(1) : 0}%
                            </div>
                        </div>
                        <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                            <strong>Analysis: </strong>
                            {predictionResult.explanation}
                        </div>
                    </div>
                ) : (
                    <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
                        <h3>Error loading results</h3>
                        <p>{predictionResult?.error || "Unknown error occurred"}</p>
                    </div>
                )}
            </motion.div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button className="submit-btn" style={{ width: 'auto' }} onClick={() => navigate('/')}>
                    Test New Sample
                </button>
            </div>
        </div>
    );
};

export default Results;
