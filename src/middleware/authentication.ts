import { ContextType, UserType } from "../types/context";
import { Role } from "../types/enums";

export interface AuthContext {
  currentUser: UserType;
  isAuthenticated: boolean;
}

export class AuthMiddleware {
  static requireAuth(context: ContextType): boolean {
    return context.currentUser !== null && context.currentUser !== undefined;
  }

  static requireRole(context: ContextType, roles: Role[]): boolean {
    if (!this.requireAuth(context)) {
      return false;
    }
    return roles.includes(context.currentUser.role);
  }

  static requireManagerOrHigher(context: ContextType): boolean {
    return this.requireRole(context, [Role.MANAGER, Role.HR, Role.ADMIN]);
  }

  static requireHROrAdmin(context: ContextType): boolean {
    return this.requireRole(context, [Role.HR, Role.ADMIN]);
  }

  static requireAdmin(context: ContextType): boolean {
    return this.requireRole(context, [Role.ADMIN]);
  }

  static canViewRecognition(context: ContextType, recognition: any): boolean {
    if (!this.requireAuth(context)) {
      return false;
    }

    const currentUser = context.currentUser;

    // HR and Admin can view all recognitions
    if (this.requireHROrAdmin(context)) {
      return true;
    }

    // Users can always view their own recognitions
    if (recognition.toUserId === currentUser.id) {
      return true;
    }

    // Users can view recognitions they sent unless anonymous
    if (recognition.fromUserId === currentUser.id && recognition.visibility !== 'ANONYMOUS') {
      return true;
    }

    // Public recognitions are visible to everyone
    if (recognition.visibility === 'PUBLIC') {
      return true;
    }

    // Private recognitions are only visible to sender and recipient
    if (recognition.visibility === 'PRIVATE') {
      return recognition.fromUserId === currentUser.id || recognition.toUserId === currentUser.id;
    }

    // Anonymous recognitions are only visible to recipient
    if (recognition.visibility === 'ANONYMOUS') {
      return recognition.toUserId === currentUser.id;
    }

    return false;
  }

  static canDeleteRecognition(context: ContextType, recognition: any): boolean {
    if (!this.requireAuth(context)) {
      return false;
    }

    const currentUser = context.currentUser;

    // HR and Admin can delete any recognition
    if (this.requireHROrAdmin(context)) {
      return true;
    }

    // Users can delete their own recognitions
    return recognition.fromUserId === currentUser.id;
  }

  static canViewTeamData(context: ContextType, teamId: string): boolean {
    if (!this.requireAuth(context)) {
      return false;
    }

    const currentUser = context.currentUser;

    // HR and Admin can view all team data
    if (this.requireHROrAdmin(context)) {
      return true;
    }

    // Managers can view their team data
    if (currentUser.role === Role.MANAGER) {
      return currentUser.teamId === teamId;
    }

    // Employees can only view their own team data
    return currentUser.teamId === teamId;
  }

  static canViewAnalytics(context: ContextType): boolean {
    return this.requireManagerOrHigher(context);
  }

  static canViewUserData(context: ContextType, targetUserId: string): boolean {
    if (!this.requireAuth(context)) {
      return false;
    }

    const currentUser = context.currentUser;

    // HR and Admin can view all user data
    if (this.requireHROrAdmin(context)) {
      return true;
    }

    // Users can view their own data
    if (currentUser.id === targetUserId) {
      return true;
    }

    // Managers can view their team members' data
    if (currentUser.role === Role.MANAGER) {
      const targetUser = context.users.find(u => u.id === targetUserId);
      return targetUser ? targetUser.teamId === currentUser.teamId : false;
    }

    return false;
  }

  static getCurrentUserRole(context: ContextType): Role | null {
    if (!this.requireAuth(context)) {
      return null;
    }
    return context.currentUser.role;
  }

  static isCurrentUser(userId: string, context: ContextType): boolean {
    return context.currentUser.id === userId;
  }
}
