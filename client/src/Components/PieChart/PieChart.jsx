import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import './PieChart.css'; 
import Chart from 'chart.js/auto'; 

const PieChart = ({ month }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartInstance = useRef(null); // Reference to store chart instance

  useEffect(() => {
    fetchData();
  }, [month]); // Re-run effect whenever month changes

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const monthNumber = getMonthNumber(month);
      const response = await axios.get(`http://localhost:7000/api/v1/pie-chart?month=${monthNumber}`);
      if (response.data.success) {
        setData(response.data.pieChartData);
      } else {
        setError('No data found.');
      }
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
      setError('Error fetching pie chart data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getMonthNumber = (monthName) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames.indexOf(monthName) + 1;
  };

  useEffect(() => {
    // Cleanup previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    // Create new chart instance
    if (data && !loading && !error) {
      const ctx = document.getElementById('pie-chart-canvas');
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.map(item => item.category),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
            ],
          }],
        },
      });
    }
  }, [data, loading, error]); 

  return (
    <div className="pie-chart">
      <h3>Pie Chart - {month}</h3>
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && data && data.length === 0 && <div>No data available</div>}
      {!loading && !error && data && data.length > 0 && (
        <canvas id="pie-chart-canvas" />
      )}
    </div>
  );
};

export default PieChart;
