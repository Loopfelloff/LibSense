import { redisClient } from "../config/redisConfiguration.js";

const getProfileController = async (req: Request, res: Response) => {
  try {
    await redisClient.connect();
  } catch (err) {}
};
