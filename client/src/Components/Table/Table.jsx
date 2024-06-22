import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css'; 
import PieChart from '../PieChart/PieChart';
import BarChart from '../BarChart/BarChart';
import Statistics from '../Statistics/Statistics';

const Table = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchText, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/v1/transactions', {
        params: {
          month: getMonthNumber(selectedMonth),
          search: searchText,
          page: currentPage,
          perPage: 10,
        },
      });

      const totalCount = response.data.total || 0;
      setTransactions(response.data.transactions);
      setTotalPages(Math.ceil(totalCount / 10));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTotalPages(1);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = () => {
    fetchTransactions();
  };

  const getMonthNumber = (monthName) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames.indexOf(monthName) + 1;
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      
    }
  };
  
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      
    }
  };

  return (
    <div className="Table">
      <h2>Transactions Table</h2>
      <select value={selectedMonth} onChange={handleMonthChange}>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <input type="text" value={searchText} onChange={handleSearchChange} placeholder="Search by title..." />
      <button onClick={handleSearchSubmit}>Search</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Date of Sale</th>
            <th>Image</th>
            
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={`${transaction._id}-${index}`}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td><img src={transaction.image} alt={transaction.title} style={{ width: '100px', height: 'auto' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevClick} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextClick} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="ChartsContainer">
        <BarChart month={selectedMonth} />
        <Statistics month={selectedMonth} />
        <PieChart month={selectedMonth} />
      </div>
    </div>
  );
};

export default Table;
