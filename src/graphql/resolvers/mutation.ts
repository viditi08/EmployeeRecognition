import { ContextType } from "../../types/context";
import { v4 as uuidv4 } from "uuid";
import { AnalyticsService } from "../../services/analyticsService";
import { SlackService } from "../../services/slackService";
import { AuthMiddleware } from "../../middleware/authentication";

export const Mutation = {
  sendRecognition: (
    _parent: any,
    args: {
      input: {
        toUserId: string;
        message: string;
        emoji: string;
        visibility: string;
      };
    },
    context: ContextType
  ) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }

    const { input } = args;

    const recipient = context.users.find(u => u.id === input.toUserId);
    if (!recipient) {
      throw new Error("Recipient not found");
    }

    const keywords = AnalyticsService.extractKeywords(input.message);

    const newRecognition = {
      id: uuidv4(),
      fromUserId: input.visibility === "ANONYMOUS" ? null : context.currentUser.id,
      toUserId: input.toUserId,
      message: input.message,
      emoji: input.emoji,
      visibility: input.visibility,
      createdAt: new Date().toISOString(),
      keywords
    };

    context.recognitions.push(newRecognition);

    (context.pubsub as any).publish("RECOGNITION_RECEIVED", newRecognition);
    (context.pubsub as any).publish("TEAM_RECOGNITION_UPDATE", newRecognition);

    SlackService.sendRecognitionNotification(newRecognition, recipient.name);

    return newRecognition;
  },

  deleteRecognition: (
    _parent: any,
    args: { id: string },
    context: ContextType
  ) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }

    const recognition = context.recognitions.find(r => r.id === args.id);
    if (!recognition) {
      throw new Error("Recognition not found");
    }

    if (!AuthMiddleware.canDeleteRecognition(context, recognition)) {
      throw new Error("Not authorized to delete this recognition");
    }

    const index = context.recognitions.findIndex(r => r.id === args.id);
    context.recognitions.splice(index, 1);

    return true;
  },

  markNotificationAsRead: (
    _parent: any,
    args: { id: string },
    context: ContextType
  ) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }

    const notification = context.notifications.find(n => n.id === args.id);
    if (!notification) {
      throw new Error("Notification not found");
    }

    // Check if user owns this notification
    if (notification.userId !== context.currentUser.id) {
      throw new Error("Not authorized to mark this notification as read");
    }

    notification.read = true;

    return notification;
  },

  markAllNotificationsAsRead: (
    _parent: any,
    _args: any,
    context: ContextType
  ) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }

    context.notifications
      .filter(n => n.userId === context.currentUser.id)
      .forEach(n => n.read = true);

    return true;
  },

  updateProfile: (
    _parent: any,
    args: { name?: string; email?: string },
    context: ContextType
  ) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }

    // In a real implementation, this would update the user in the database
    // For now, return the current user with updated fields
    return {
      ...context.currentUser,
      name: args.name || context.currentUser.name,
      email: args.email || context.currentUser.email
    };
  }
};
