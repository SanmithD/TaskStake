import { tool } from "@langchain/core/tools";
import z from "zod";
import { submissionModel } from "../models/submission.model.js";

export const verifyImage = tool(
  async({ submissionId }) => {
    try {
      const submission = await submissionModel.findById(submissionId).populate('taskId');
      if (!submission) throw new Error("Submission not found");
      
      const task = submission.taskId;
      const photoUrl = submission.photo;
      
      if (!photoUrl) throw new Error("No photo found in submission");
      
      return {
        success: true,
        taskTitle: task.title,
        taskDescription: task.description || '',
        taskStartDate: task.startAt,
        taskEndDate: task.endAt,
        submissionDate: submission.createdAt,
        photoUrl: photoUrl,
        taskType: task.type || 'general'
      };
    } catch (error) {
      console.log(error);
      throw new Error(`Verification tool error: ${error.message}`);
    }
  },
  {
    name: "verify_image_against_task",
    description: "Fetch submission and task details for AI verification of photo relevance",
    schema: z.object({
      submissionId: z.string().describe("Submission ID to verify")
    })
  }
);

export const analyzeImage = tool(
  async (subId) => {
    const response = await submissionModel.findById(subId);
    return { result: response.photo };
  },
  {
    name: "analyze_image",
    description: "Fetches a submission photo by its ID",
    schema: z.object({
      subId: z.string().describe("Submission Id")
    })
  }
);
