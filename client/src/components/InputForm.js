import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PARAMETERS = [
    { name: "ph", label: "pH Value", min: 0, max: 14, step: 0.1 },
    { name: "Hardness", label: "Hardness (mg/L)", min: 0, max: 500, step: 1 },
    { name: "Solids", label: "Solids (ppm)", min: 0, max: 100000, step: 10 },
    { name: "Chloramines", label: "Chloramines (ppm)", min: 0, max: 20, step: 0.1 },
    { name: "Sulfate", label: "Sulfate (mg/L)", min: 0, max: 1000, step: 1 },
    { name: "Conductivity", label: "Conductivity (μS/cm)", min: 0, max: 1000, step: 1 },
    { name: "Organic_carbon", label: "Organic Carbon (ppm)", min: 0, max: 100, step: 0.1 },
    { name: "Trihalomethanes", label: "Trihalomethanes (μg/L)", min: 0, max: 200, step: 0.1 },
    { name: "Turbidity", label: "Turbidity (NTU)", min: 0, max: 10, step: 0.1 }
];

const InputForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ph: "", Hardness: "", Solids: "", Chloramines: "", Sulfate: "",
        Conductivity: "", Organic_carbon: "", Trihalomethanes: "", Turbidity: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic Validation
        const values = Object.values(formData);
        if (values.some(val => val === "")) {
            alert("Please fill in all fields");
            return;
        }
        
        // Navigate to Results with data
        navigate('/results', { state: formData });
    };

    return (
        <div className="glass-panel">
            <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                Water Quality Assessment
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {PARAMETERS.map((param) => (
                        <motion.div 
                            key={param.name} 
                            className="input-group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label>{param.label}</label>
                            <input
                                type="number"
                                name={param.name}
                                value={formData[param.name]}
                                onChange={handleChange}
                                placeholder={`Enter ${param.label}`}
                                step={param.step}
                            />
                        </motion.div>
                    ))}
                </div>
                <motion.button 
                    type="submit" 
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Analyze Sample
                </motion.button>
            </form>
        </div>
    );
};

export default InputForm;
