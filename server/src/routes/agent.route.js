import express from "express";
import { runAgentOnSubmission } from "../controllers/agent.controller.js";

const agentRouter = express.Router();

agentRouter.post("/verify/:subId", runAgentOnSubmission);

export default agentRouter;
