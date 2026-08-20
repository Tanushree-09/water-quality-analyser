# Water Quality Analyser

A full-stack IoT and machine learning application designed to monitor, assess, and visualize water safety parameters in real-time. This system processes live inputs from hardware sensor probes, displays dynamic graphical data on an interactive React dashboard, and utilizes a Flask backend powered by a predictive voting model to determine potability.

---

## 🚀 Features
* **Real-Time Data Streams & Graphing:** Captures live data from hardware sensor probes (including Turbidity and Hardness sensors) and visualizes the trends instantly via dynamic display graphs.
* **Predictive Analysis:** Implements an ensemble voting classifier (`water_potability_voting_model.joblib`) to predict overall water safety based on sensor inputs.
* **History Smoothing:** Uses data queues (`deque`) to track moving histories and eliminate flickering predictions caused by temporary sensor fluctuations.
* **Interactive UI:** A modern dashboard UI built with React to view live metrics, graphical data tracking, and detailed analytical forms.
* **Potability Results:** Shows in the potability (water usability) in percentage and provides recommendations of steps to be taken

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js
* **Visualizations:** Charting libraries (e.g., Chart.js / Recharts) for real-time sensor graphs
* **API Client:** Fetch API (configured with CORS to communicate across ports)

### Backend & ML
* **Server Framework:** Python / Flask
* **Machine Learning:** Scikit-learn (Joblib serialization)
* **Data Handling:** Pandas, Numpy, Collections (`deque`)
* **Inference Tools:** Hugging Face Hub Client integration

---

## 📦 Project Structure
```text
water_quality_analyser/
├── client/                 # React Frontend Application
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/     # InputForm.js, Results.js
│   │   ├── App.css
│   │   ├── App.js          # Main UI Component
│   │   ├── App.test.js
│   │   ├── Dashboard.js    # Live Metrics & Real-time Graph Dashboard
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── .gitignore          # Keeps node_modules out of GitHub
│   ├── package-lock.json
│   └── package.json
└── server/                 # Flask Backend & Machine Learning
    ├── app.py              # Main API routing, ESP32 data streaming & model logic
    ├── list_models.py      # Model validation utility
    ├── test_hf.py          # Testing script for Hugging Face Inference API
    └── requirements.txt    # Required Python dependencies
