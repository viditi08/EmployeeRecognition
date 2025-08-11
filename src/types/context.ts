import { PubSub } from "graphql-subscriptions";
import { Role } from "./enums";
import { PubSubEvents } from "./events";

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamId: string;
}

export interface TeamType {
  id: string;
  name: string;
}

export interface RecognitionType {
  id: string;
  message: string;
  emoji: string;
  fromUserId: string | null;
  toUserId: string;
  visibility: string;
  createdAt: string;
  keywords: string[];
}

export interface NotificationType {
  id: string;
  type: string;
  message: string;
  recognitionId?: string;
  userId: string;
  createdAt: string;
  read: boolean;
}

export interface ContextType {
  users: UserType[];
  teams: TeamType[];
  recognitions: RecognitionType[];
  notifications: NotificationType[];
  currentUser: UserType;
  pubsub: PubSub<PubSubEvents>;
}

