import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [data, setData] = useState([]);
  const [visibleParam, setVisibleParam] = useState('speed'); 

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://localhost:8000/data')
        .then(response => setData(response.data))
        .catch(error => console.error("Error fetching data: ", error));
    };

    fetchData(); 
    const interval = setInterval(fetchData, 5000); 

    return () => clearInterval(interval); 
  }, []);
  const processChartData = (key) => {
    const labels = data.map(item => item.timestamp);
    const values = data.map(item => item[key]);
    return {
      labels: labels,
      datasets: [{
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      }],
    };
  };

  return (
    <div className="container">
      <h1 style={{ fontFamily: 'Open Sans', fontWeight:'bold' }}>Visualization</h1>

      <div className="parameter-card">
        <div className="param-buttons">
          <button className={`param-btn ${visibleParam === 'speed' ? 'active' : ''}`} onClick={() => setVisibleParam('speed')}>Speed</button>
          <button className={`param-btn ${visibleParam === 'fuelLevel' ? 'active' : ''}`} onClick={() => setVisibleParam('fuelLevel')}>Fuel Level</button>
          <button className={`param-btn ${visibleParam === 'tirePressure' ? 'active' : ''}`} onClick={() => setVisibleParam('tirePressure')}>Tire Pressure</button>
          <button className={`param-btn ${visibleParam === 'temperature' ? 'active' : ''}`} onClick={() => setVisibleParam('temperature')}>Temperature</button>
        </div>
      </div>

      <div className="chart-container">
        <Line data={processChartData(visibleParam)} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default App;
