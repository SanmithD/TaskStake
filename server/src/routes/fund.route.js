import express from "express";
import { addFund, getFunds, withdrawFund } from "../controllers/fund.controller.js";
import { isAuthorized } from "../middlewares/administer.middleware.js";


const fundRouter = express.Router();

fundRouter.post("/add", isAuthorized, addFund);
fundRouter.get("/get", isAuthorized, getFunds);
fundRouter.post("/withdraw", isAuthorized, withdrawFund);
// fundRouter.post("/reset", isAuthorized, resetFunds); 

export default fundRouter;
