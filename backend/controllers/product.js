import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import axios from "axios";
import Product from "../models/product.js";

// Define the API URL
const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json'; 

export const fetchDataAndStore = catchAsyncError(async (req, res, next) => {
  const response = await axios.get(apiUrl);
  const products = response.data;
  await Product.insertMany(products);
  res.status(201).json({
    success: true,
    message: "Data added Successfully",
  });
});

export const transaction = catchAsyncError(async (req, res) => {
  const month = parseInt(req.query.month);
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month parameter. Please provide a value between 1 and 12.",
    });
  }

  const query = { $expr: { $eq: [{ $month: "$dateOfSale" }, month] } };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Product.countDocuments(query);
  const transactions = await Product.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage);

  res.status(200).json({
    success: true,
    total,
    transactions,
  });
});

export const statistics = catchAsyncError(async (req, res) => {
  const month = parseInt(req.query.month);

  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month parameter. Please provide a value between 1 and 12.",
    });
  }

  const query = { $expr: { $eq: [{ $month: "$dateOfSale" }, month] } };

  const totalSaleAmount = await Product.aggregate([
    { $match: query },
    { $group: { _id: null, totalAmount: { $sum: "$price" } } }
  ]);

  const totalSoldItems = await Product.countDocuments({ ...query, sold: true });
  const totalUnsoldItems = await Product.countDocuments({ ...query, sold: false });

  const statistics = {
    totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
    totalSoldItems,
    totalUnsoldItems
  };

  res.status(200).json({
    success: true,
    statistics
  });
});


export const Bar_chart = catchAsyncError(async (req, res) => {
  const month = parseInt(req.query.month);

  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month parameter. Please provide a value between 1 and 12.",
    });
  }

  const query = { $expr: { $eq: [{ $month: "$dateOfSale" }, month] } };

  const products = await Product.find(query);

  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Number.POSITIVE_INFINITY },
  ];

  const priceRangeCounts = {};

  priceRanges.forEach(({ min, max }) => {
    const count = products.filter(product => product.price >= min && product.price <= max).length;
    priceRangeCounts[`${min}-${max}`] = count;
  });

  const barChartData = {
    month,
    priceRangeCounts,
  };

  res.status(200).json({
    success: true,
    barChartData,
  });
});

export const Pie_chart = catchAsyncError(async (req, res) => {
  const month = parseInt(req.query.month);

  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month parameter. Please provide a value between 1 and 12.",
    });
  }

  const query = { $expr: { $eq: [{ $month: "$dateOfSale" }, month] } };

  const products = await Product.find(query);

  const categoryCounts = {};
  products.forEach(product => {
    if (!categoryCounts[product.category]) {
      categoryCounts[product.category] = 0;
    }
    categoryCounts[product.category]++;
  });

  const pieChartData = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

  res.status(200).json({
    success: true,
    pieChartData
  });
});

export const combinedData = catchAsyncError(async (req, res) => {
  const month = parseInt(req.query.month);

  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month parameter. Please provide a value between 1 and 12.",
    });
  }

  const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
    axios.get(`http://localhost:7000/api/v1/statistics?month=${month}`),
    axios.get(`http://localhost:7000/api/v1/bar-chart?month=${month}`),
    axios.get(`http://localhost:7000/api/v1/pie-chart?month=${month}`)
  ]);

  const combinedData = {
    statistics: statisticsResponse.data,
    barChart: barChartResponse.data,
    pieChart: pieChartResponse.data
  };

  res.status(200).json({
    success: true,
    data: combinedData
  });
});
