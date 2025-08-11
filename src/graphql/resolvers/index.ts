import { Query } from "./query";
import { Mutation } from "./mutation";
import { Subscription } from "./subscription";
import { ContextType, RecognitionType, UserType } from "../../types/context";

export default {
  Query,
  Mutation,
  Subscription,
  User: {
    team: (parent: UserType, _args: any, context: ContextType) => {
      return context.teams.find(t => t.id === parent.teamId);
    },
    recognitionsGiven: (parent: UserType, _args: any, context: ContextType) =>
      context.recognitions.filter(r => r.fromUserId === parent.id),
    recognitionsReceived: (parent: UserType, _args: any, context: ContextType) =>
      context.recognitions.filter(r => r.toUserId === parent.id),
    totalRecognitionsGiven: (parent: UserType, _args: any, context: ContextType) =>
      context.recognitions.filter(r => r.fromUserId === parent.id).length,
    totalRecognitionsReceived: (parent: UserType, _args: any, context: ContextType) =>
      context.recognitions.filter(r => r.toUserId === parent.id).length,
  },
  Recognition: {
    from: (parent: RecognitionType, _args: any, context: ContextType) =>
      parent.visibility === "ANONYMOUS" ? null : context.users.find(u => u.id === parent.fromUserId),
    to: (parent: RecognitionType, _args: any, context: ContextType) =>
      context.users.find(u => u.id === parent.toUserId),
  },
  Team: {
    members: (parent: any, _args: any, context: ContextType) =>
      context.users.filter(u => u.teamId === parent.id),
    totalRecognitions: (parent: any, _args: any, context: ContextType) => {
      const teamUserIds = context.users.filter(u => u.teamId === parent.id).map(u => u.id);
      return context.recognitions.filter(r => teamUserIds.includes(r.toUserId)).length;
    },
  },
};
