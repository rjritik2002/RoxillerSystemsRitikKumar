import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './Barchart.css';

function BarChart({ month }) {
  const [barChartData, setBarChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const fetchBarChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const monthNumber = getMonthNumber(month);
      const response = await axios.get(`http://localhost:7000/api/v1/bar-chart?month=${monthNumber}`);
      if (response.data && response.data.barChartData) {
        setBarChartData(response.data.barChartData);
      } else {
        setError('No data found.');
        setBarChartData(null);
      }
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      setError('Error fetching bar chart data. Please try again later.');
      setBarChartData(null);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!barChartData) {
    return <div>No data available</div>;
  }

  const { priceRangeCounts } = barChartData;
  const labels = Object.keys(priceRangeCounts);
  const data = Object.values(priceRangeCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Number of Items',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="Barchart">
      <h2>Bar Chart Stats - {month}</h2>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default BarChart;
