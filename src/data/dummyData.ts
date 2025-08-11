import { Role, Visibility } from "../types/enums";

export const users = [
  { id: "1", name: "Liam Carter", email: "liam@example.com", role: Role.EMPLOYEE, teamId: "t1" },
  { id: "2", name: "Sophia Green", email: "sophia@example.com", role: Role.EMPLOYEE, teamId: "t1" },
  { id: "3", name: "Noah Wright", email: "noah@example.com", role: Role.MANAGER, teamId: "t1" },
  { id: "4", name: "Olivia Martin", email: "olivia@example.com", role: Role.HR, teamId: "t2" },
  { id: "5", name: "Ethan Scott", email: "ethan@example.com", role: Role.EMPLOYEE, teamId: "t2" },
  { id: "6", name: "Ava Turner", email: "ava@example.com", role: Role.EMPLOYEE, teamId: "t3" },
  { id: "7", name: "William Brooks", email: "william@example.com", role: Role.MANAGER, teamId: "t3" },
  { id: "8", name: "Mia Adams", email: "mia@example.com", role: Role.ADMIN, teamId: "t1" },
];

export const teams = [
  { id: "t1", name: "Development" },
  { id: "t2", name: "Human Resources" },
  { id: "t3", name: "Design" },
];

export const recognitions = [
  {
    id: "r1",
    message: "Fantastic collaboration on the API integration — it went live without a hitch!",
    emoji: "🚀",
    fromUserId: "1",
    toUserId: "2",
    visibility: Visibility.PUBLIC,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    keywords: ["collaboration", "API", "integration", "fantastic", "live"]
  },
  {
    id: "r2",
    message: "Appreciate your quick thinking during the client call yesterday.",
    emoji: "🤝",
    fromUserId: null,
    toUserId: "1",
    visibility: Visibility.ANONYMOUS,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    keywords: ["quick", "thinking", "client", "call", "appreciate"]
  },
  {
    id: "r3",
    message: "Your guidance has helped the junior devs grow tremendously.",
    emoji: "🌱",
    fromUserId: "2",
    toUserId: "3",
    visibility: Visibility.PUBLIC,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    keywords: ["guidance", "mentorship", "growth", "team"]
  },
  {
    id: "r4",
    message: "Impressive work delivering the dashboard redesign ahead of schedule!",
    emoji: "🎯",
    fromUserId: "3",
    toUserId: "1",
    visibility: Visibility.PUBLIC,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    keywords: ["dashboard", "redesign", "ahead", "schedule", "impressive"]
  },
  {
    id: "r5",
    message: "Your cheerful energy makes team meetings so much more engaging.",
    emoji: "😊",
    fromUserId: "4",
    toUserId: "5",
    visibility: Visibility.PRIVATE,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    keywords: ["cheerful", "energy", "team", "meetings", "engaging"]
  },
  {
    id: "r6",
    message: "Brilliant job solving the production outage in record time!",
    emoji: "⚡",
    fromUserId: "6",
    toUserId: "7",
    visibility: Visibility.PUBLIC,
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    keywords: ["problem-solving", "production", "outage", "brilliant", "speed"]
  }
];

export const notifications = [
  {
    id: "n1",
    type: "RECOGNITION_RECEIVED",
    message: "You received a recognition from Liam Carter",
    recognitionId: "r1",
    userId: "2",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: false
  },
  {
    id: "n2",
    type: "RECOGNITION_RECEIVED",
    message: "You received an anonymous recognition",
    recognitionId: "r2",
    userId: "1",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    read: true
  },
  {
    id: "n3",
    type: "RECOGNITION_RECEIVED",
    message: "You received a recognition from Sophia Green",
    recognitionId: "r3",
    userId: "3",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    read: true
  }
];
