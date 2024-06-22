import express from "express";
import { Bar_chart, Pie_chart, combinedData, fetchDataAndStore, statistics, transaction  } from "../controllers/product.js";


const router = express.Router();


router.get("/getAllData", fetchDataAndStore);

router.get("/transactions",transaction);

router.get("/statistics",statistics)

router.get("/bar-chart",Bar_chart)

router.get('/pie-chart',Pie_chart)

router.get("/combined-data",combinedData)



export default router;