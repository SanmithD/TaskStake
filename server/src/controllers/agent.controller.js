import { agent } from '../config/agent.config.js';

export default async function performAIVerification(submissionId, task) {
  try {
    const result = await agent.invoke({
      messages: [
        {
          role: "system",
          content: `You are a strict photo verification AI. Your job is to verify if a submitted photo is relevant and valid for the given task.
          
          Verification Criteria:
          1. Photo must be relevant to the task title and description
          2. Photo should be appropriate for the task's date/time context
          3. Photo should show genuine effort to complete the task
          4. Photo must not be obviously fake, stock image, or unrelated
          
          Respond with:
          - "VALID" if the photo meets all criteria
          - "INVALID" if the photo fails any criteria
          
          Always provide a brief reason for your decision.`
        },
        {
          role: "user",
          content: `Please verify this photo submission using the verify_image_against_task tool with submissionId: ${submissionId}`
        }
      ]
    });

    // Parse AI response
    let responseText = "";
    if (result.messages && result.messages.length > 0) {
      responseText = result.messages[result.messages.length - 1].content;
    } else if (result.output) {
      responseText = result.output;
    } else {
      responseText = String(result);
    }

    const isValid = /VALID|valid|approved|accept/i.test(responseText) && 
                   !/INVALID|invalid|reject|denied/i.test(responseText);

    return {
      ok: isValid,
      reason: isValid 
        ? "Photo verified by AI - matches task requirements" 
        : `Photo rejected by AI: ${responseText}`
    };

      } catch (error) {
    throw new Error(`AI verification failed: ${error.message}`);
  }
}


export const verifyImageDetails = async (req, res) => {
  const { subId } = req.params;
  try {
    const result = await agent.invoke({
      messages: [
        {
          role: "system",
          content: `You are a strict photo verification AI. Your job is to verify if a submitted photo is relevant and valid for the given task.
          
          Verification Criteria:
          1. Photo must be relevant to the task title and description
          2. Photo should be appropriate for the task's date/time context
          3. Photo should show genuine effort to complete the task
          4. Photo must not be obviously fake, stock image, or unrelated
          
          Respond with:
          - "VALID" if the photo meets all criteria
          - "INVALID" if the photo fails any criteria
          
          Always provide a brief reason for your decision.`
        },
        {
  role: "user",
  content: `Please verify this photo submission using the Analzy_image tool with subId: ${subId}`
}

      ]
    });

    console.log("Agent result:", result.content);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


