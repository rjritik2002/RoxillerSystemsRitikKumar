import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';

const Statistics = ({ month }) => {
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalUnsoldItems, setTotalUnsoldItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (month !== undefined) {
      fetchStatistics();
    }
  }, [month]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const monthNumber = getMonthNumber(month);
      const response = await axios.get(`http://localhost:7000/api/v1/statistics?month=${monthNumber}`);
      const { totalSaleAmount, totalSoldItems, totalUnsoldItems } = response.data.statistics;
      setTotalSaleAmount(totalSaleAmount);
      setTotalSoldItems(totalSoldItems);
      setTotalUnsoldItems(totalUnsoldItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to fetch statistics');
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
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if data fetch fails
  }

  return (
    <div className="Statistics">
      <h2>Transactions Statistics - {month}</h2>
      <p>Total Sale Amount: <span className="total">${totalSaleAmount}</span></p>
      <p>Total Sold Items: <span className="total">{totalSoldItems}</span></p>
      <p>Total Unsold Items: <span className="total">{totalUnsoldItems}</span></p>
    </div>
  );
};

export default Statistics;
