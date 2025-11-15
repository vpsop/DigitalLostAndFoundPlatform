import { INotification } from "../models/Notification";
import { Types } from "mongoose";


export interface INotificationService {
  createNotification(
    userId: Types.ObjectId,
    title: string,
    message: string,
    type?: "info" | "warning" | "alert" | "success",
    link?: string
  ): Promise<INotification>;

  getUserNotifications(
    userId: Types.ObjectId,
    onlyUnread?: boolean
  ): Promise<INotification[]>;

  markAsRead(notificationId: Types.ObjectId): Promise<INotification | null>;

  markAllAsRead(userId: Types.ObjectId): Promise<number>;

  deleteNotification(notificationId: Types.ObjectId): Promise<boolean>;

  clearUserNotifications(userId: Types.ObjectId): Promise<number>;
}