import { agent } from "../config/agent.config.js";
import verifyAndSettle from "../config/verify.config.js";
import { submissionModel } from "../models/submission.model.js";

export const runAgentOnSubmission = async (req, res) => {
  try {
    const { subId } = req.params;
    const submission = await submissionModel.findById(subId);

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    if (submission.photo) {
      const result = await agent.invoke({
        messages: [
          {
            role: "system",
            content: "You are a photo verification agent. Verify authenticity.",
          },
          {
            role: "user",
            content: `Verify if this photo is valid for task ${submission.taskId}`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: submission.photo
              }
            ]
          }
        ]
      });

      const responseText = result.output_text || "";
      const isValid = /valid|ok|approved/i.test(responseText);

      // Now update based on agent decision
      const settlement = await verifyAndSettle(subId, isValid);

      return res.json({
        message: "Verification completed",
        agentResponse: responseText,
        settlement
      });
    } else {
      return res.status(400).json({ error: "No photo submitted for verification" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
