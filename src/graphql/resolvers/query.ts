import { ContextType } from "../../types/context";
import { AnalyticsService } from "../../services/analyticsService";
import { AuthMiddleware } from "../../middleware/authentication";

export const Query = {
  getUser: (_parent: any, args: { id: string }, context: ContextType) => {
    if (!AuthMiddleware.canViewUserData(context, args.id)) {
      throw new Error("Not authorized to view this user's data");
    }
    return context.users.find(u => u.id === args.id);
  },

  getMyProfile: (_parent: any, _args: any, context: ContextType) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }
    return context.currentUser;
  },

  getMyRecognitions: (_parent: any, _args: any, context: ContextType) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }
    return context.recognitions.filter(r => r.toUserId === context.currentUser.id);
  },

  getTeams: (_parent: any, _args: any, context: ContextType) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }
    return context.teams;
  },

  getTeam: (_parent: any, args: { id: string }, context: ContextType) => {
    if (!AuthMiddleware.canViewTeamData(context, args.id)) {
      throw new Error("Not authorized to view this team's data");
    }
    return context.teams.find(t => t.id === args.id);
  },

  getRecognitionsByTeam: (_parent: any, args: { teamId: string }, context: ContextType) => {
    if (!AuthMiddleware.canViewTeamData(context, args.teamId)) {
      throw new Error("Not authorized to view this team's recognitions");
    }
    const teamUserIds = context.users
      .filter(u => u.teamId === args.teamId)
      .map(u => u.id);
    return context.recognitions.filter(r => teamUserIds.includes(r.toUserId));
  },

  getRecognitionsByUser: (_parent: any, args: { userId: string }, context: ContextType) => {
    if (!AuthMiddleware.canViewUserData(context, args.userId)) {
      throw new Error("Not authorized to view this user's recognitions");
    }
    return context.recognitions.filter(r => r.toUserId === args.userId);
  },

  getAllRecognitions: (_parent: any, _args: any, context: ContextType) => {
    if (!AuthMiddleware.requireHROrAdmin(context)) {
      throw new Error("Not authorized");
    }
    return context.recognitions;
  },

  getAnalytics: (_parent: any, args: { input: { period: string; teamId?: string; keyword?: string } }, context: ContextType) => {
    if (!AuthMiddleware.canViewAnalytics(context)) {
      throw new Error("Not authorized to view analytics");
    }
    
    return AnalyticsService.getComprehensiveAnalytics(args.input.period, context);
  },

  getTeamAnalytics: (_parent: any, args: { teamId: string; period: string }, context: ContextType) => {
    if (!AuthMiddleware.canViewAnalytics(context)) {
      throw new Error("Not authorized to view analytics");
    }

    if (!AuthMiddleware.canViewTeamData(context, args.teamId)) {
      throw new Error("Not authorized to view this team's analytics");
    }

    const team = context.teams.find(t => t.id === args.teamId);
    if (!team) throw new Error("Team not found");

    const teamAnalytics = AnalyticsService.getTeamAnalytics(args.teamId, context);
    return {
      team,
      ...teamAnalytics
    };
  },

  getKeywordAnalytics: (_parent: any, args: { keyword: string; period: string }, context: ContextType) => {
    if (!AuthMiddleware.canViewAnalytics(context)) {
      throw new Error("Not authorized to view analytics");
    }

    return AnalyticsService.getKeywordAnalytics(args.keyword, context);
  },

  getMyNotifications: (_parent: any, _args: any, context: ContextType) => {
    if (!AuthMiddleware.requireAuth(context)) {
      throw new Error("Authentication required");
    }
    return context.notifications.filter(n => n.userId === context.currentUser.id);
  }
};
