import { tool } from "@langchain/core/tools";
import z from "zod";
import { submissionModel } from "../models/submission.model.js";

export const verifyImage = tool(
    async({ taskId }) =>{
        try {
            const response = await submissionModel.findOne({ taskId }).select("photo");
            if(!response) throw new Error("Not found");

            return {
                result: response
            }
        } catch (error) {
            console.log(error);
            throw new Error("Server error");
        }
    },{
        name: "Photo_verification",
        description: "Verify the photo details",
        schema: z.object({
            taskId: z.string().describe("Task id to fetch data")
        })
    }
)