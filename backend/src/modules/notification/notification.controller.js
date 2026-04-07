import { asyncHandler } from "../../common/utils/asyncHandler.js";
import Notification from "./notification.model.js";
import { successResponse } from "../../common/utils/apiResponse.js";
import logger from "../../config/logger.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  return successResponse(
    res,
    200,
    notifications,
    "Notifications retrieved successfully",
  );
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true },
  );

  if (!notification) {
    throw Object.assign(new Error("Notification not found"), {
      statusCode: 404,
    });
  }

  return successResponse(res, 200, notification, "Notification marked as read");
});
