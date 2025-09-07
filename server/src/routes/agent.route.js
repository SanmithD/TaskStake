import express from "express";
import { verifyImageDetails } from "../controllers/agent.controller.js";

const agentRouter = express.Router();

// agentRouter.post("/verify/:subId", isAuthorized, runAgentOnSubmission);
agentRouter.post("/verify/:subId", verifyImageDetails);

export default agentRouter;
