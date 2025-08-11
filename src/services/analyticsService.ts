import { ContextType, RecognitionType, UserType } from "../types/context";

export class AnalyticsService {
  static extractKeywords(message: string): string[] {
    const words = message.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3);
    
    return [...new Set(words)];
  }

  static calculateEngagementScore(user: UserType, context: ContextType): number {
    const recognitionsGiven = context.recognitions.filter(r => r.fromUserId === user.id).length;
    const recognitionsReceived = context.recognitions.filter(r => r.toUserId === user.id).length;
    
    return (recognitionsGiven + recognitionsReceived) / 10;
  }

  static getTeamAnalytics(teamId: string, context: ContextType) {
    const teamUserIds = context.users.filter(u => u.teamId === teamId).map(u => u.id);
    const teamRecognitions = context.recognitions.filter(r => teamUserIds.includes(r.toUserId));
    
    const publicRecognitions = teamRecognitions.filter(r => r.visibility === "PUBLIC");
    const privateRecognitions = teamRecognitions.filter(r => r.visibility === "PRIVATE");
    const anonymousRecognitions = teamRecognitions.filter(r => r.visibility === "ANONYMOUS");
    
    const userRecognitionCounts = teamUserIds.map(userId => {
      const received = teamRecognitions.filter(r => r.toUserId === userId).length;
      const given = teamRecognitions.filter(r => r.fromUserId === userId).length;
      return { userId, received, given };
    });
    
    const topReceivers = userRecognitionCounts
      .sort((a, b) => b.received - a.received)
      .slice(0, 3)
      .map(u => context.users.find(user => user.id === u.userId))
      .filter(Boolean);
    
    const topGivers = userRecognitionCounts
      .sort((a, b) => b.given - a.given)
      .slice(0, 3)
      .map(u => context.users.find(user => user.id === u.userId))
      .filter(Boolean);
    
    return {
      totalRecognitions: teamRecognitions.length,
      publicRecognitions: publicRecognitions.length,
      privateRecognitions: privateRecognitions.length,
      anonymousRecognitions: anonymousRecognitions.length,
      topReceivers,
      topGivers
    };
  }

  static getKeywordAnalytics(keyword: string, context: ContextType) {
    const matchingRecognitions = context.recognitions.filter(r => 
      r.message.toLowerCase().includes(keyword.toLowerCase()) ||
      r.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    return {
      keyword,
      count: matchingRecognitions.length,
      recognitions: matchingRecognitions
    };
  }

  static getComprehensiveAnalytics(period: string, context: ContextType) {
    const teamStats = context.teams.map(team => {
      const teamAnalytics = this.getTeamAnalytics(team.id, context);
      return {
        team,
        ...teamAnalytics
      };
    });
    
    // Get top keywords
    const allKeywords = context.recognitions.flatMap(r => r.keywords);
    const keywordCounts = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const keywordStats = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({
        keyword,
        count,
        recognitions: context.recognitions.filter(r => 
          r.keywords.includes(keyword)
        )
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const userStats = context.users.map(user => ({
      user,
      recognitionsReceived: context.recognitions.filter(r => r.toUserId === user.id).length,
      recognitionsGiven: context.recognitions.filter(r => r.fromUserId === user.id).length,
      engagementScore: this.calculateEngagementScore(user, context)
    }));
    
    return {
      teamStats,
      keywordStats,
      userStats,
      period
    };
  }
}
