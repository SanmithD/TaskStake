import express from "express";
import { runAgentOnSubmission } from "../controllers/agent.controller.js";
import { isAuthorized } from "../middlewares/administer.middleware.js";

const agentRouter = express.Router();

agentRouter.post("/verify/:subId", isAuthorized, runAgentOnSubmission);

export default agentRouter;
