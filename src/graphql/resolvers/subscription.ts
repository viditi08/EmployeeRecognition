import { ContextType, RecognitionType } from "../../types/context";

export const RECOGNITION_EVENT = "RECOGNITION_RECEIVED";

export const Subscription = {
  onRecognitionReceived: {
    subscribe: (_parent: any, args: { userId: string }, context: ContextType) =>
      (context.pubsub as any).asyncIterator("RECOGNITION_RECEIVED"),

    resolve: (payload: RecognitionType, args: { userId: string }) => {
      return payload.toUserId === args.userId ? payload : null;
    }
  },

  onNotificationReceived: {
    subscribe: (_parent: any, args: { userId: string }, context: ContextType) =>
      (context.pubsub as any).asyncIterator("NOTIFICATION_RECEIVED"),

    resolve: (payload: any, args: { userId: string }) => {
      return payload.userId === args.userId ? payload : null;
    }
  },

  onTeamRecognitionUpdate: {
    subscribe: (_parent: any, args: { teamId: string }, context: ContextType) =>
      (context.pubsub as any).asyncIterator("TEAM_RECOGNITION_UPDATE"),

    resolve: (payload: RecognitionType, args: { teamId: string }, context: ContextType) => {
      const teamUserIds = context.users
        .filter(u => u.teamId === args.teamId)
        .map(u => u.id);
      return teamUserIds.includes(payload.toUserId) ? payload : null;
    }
  },

  onAnalyticsUpdate: {
    subscribe: (_parent: any, args: { teamId?: string }, context: ContextType) =>
      (context.pubsub as any).asyncIterator("ANALYTICS_UPDATE"),

    resolve: (payload: any, args: { teamId?: string }) => {
      return args.teamId ? payload.teamId === args.teamId : payload;
    }
  }
};
