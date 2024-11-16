import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const HistoricalDataChart = ({ historicalData, parameter }) => {
  const data = {
    labels: historicalData.map(item => item.timestamp),
    datasets: [
      {
        label: parameter,
        data: historicalData.map(item => item[parameter]),  // Dynamically select parameter (e.g., tirePressure)
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={data} />;
};

const Dashboard = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState('tirePressure'); 

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const storedData = localStorage.getItem('historicalData');

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData)) {
            console.log('Fetched historical data from localStorage:', parsedData);
            setHistoricalData(parsedData);
          } else {
            console.error('Stored data is not an array:', parsedData);
          }
        } catch (error) {
          console.error('Error parsing historical data:', error);
        }
      } else {
        try {
          const response = await axios.get('http://localhost:8000/data');
          const data = response.data.historical_data;
          console.log('Fetched historical data from server:', data);
          setHistoricalData(data);
          localStorage.setItem('historicalData', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching historical data:', error);
          setError('Error fetching historical data');
        }
      }
    };

    fetchHistoricalData();
  }, []);

  const handleParameterChange = (parameter) => {
    setSelectedParameter(parameter);  
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {historicalData.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <div>
            <button onClick={() => handleParameterChange('tirePressure')}>Tire Pressure</button>
            <button onClick={() => handleParameterChange('speed')}>Speed</button>
            <button onClick={() => handleParameterChange('fuelLevel')}>Fuel Level</button>
            <button onClick={() => handleParameterChange('temperature')}>Temperature</button>
          </div>
          
          <HistoricalDataChart historicalData={historicalData} parameter={selectedParameter} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
