import { transport } from '../config/contact.config.js';
import { userModel } from '../models/user.model.js';
import { Response } from '../utils/Response.util.js';

export const sendMail = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, 'Unauthorized', res);

  try {
    const user = await userModel.findById(userId).select("email");
    if (!user?.email) return Response(404, false, "User not found", res);

    const { subject, message } = req.body;

    const response = await transport.sendMail({
      from: `"Task Stake App" <sanmithdevadiga91@gmail.com>`, 
      to: "sanmithdevadiga91@gmail.com",
      subject,
      text: message,
      replyTo: user.email,
    });

    if (!response) return Response(400, false, "Invalid request", res);
    Response(200, true, "Mail sent", res);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server Error", res);
  }
};
