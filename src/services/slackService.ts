import { RecognitionType } from "../types/context";

export class SlackService {
  private static webhookUrl: string | null = null;

  static setWebhookUrl(url: string) {
    this.webhookUrl = url;
  }

  static async sendRecognitionNotification(recognition: RecognitionType, recipientName: string) {
    if (!this.webhookUrl) {
      console.log('Slack webhook not configured');
      return;
    }

    const message = this.formatRecognitionMessage(recognition, recipientName);
    
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          attachments: [
            {
              color: this.getColorForVisibility(recognition.visibility),
              fields: [
                {
                  title: 'Recognition',
                  value: recognition.message,
                  short: false
                },
                {
                  title: 'From',
                  value: recognition.visibility === 'ANONYMOUS' ? 'Anonymous' : 'A colleague',
                  short: true
                },
                {
                  title: 'Visibility',
                  value: recognition.visibility,
                  short: true
                }
              ],
              footer: 'Employee Recognition System'
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
    }
  }

  private static formatRecognitionMessage(recognition: RecognitionType, recipientName: string): string {
    const emoji = recognition.emoji;
    const visibility = recognition.visibility;
    
    let message = `${emoji} *${recipientName}* received a ${visibility.toLowerCase()} recognition!\n\n`;
    message += `> "${recognition.message}"\n\n`;
    
    if (visibility === 'ANONYMOUS') {
      message += "This recognition was sent anonymously.";
    } else {
      message += "This recognition was sent by a colleague.";
    }
    
    return message;
  }

  private static getColorForVisibility(visibility: string): string {
    switch (visibility) {
      case 'PUBLIC':
        return 'good'; // Green
      case 'PRIVATE':
        return 'warning'; // Yellow
      case 'ANONYMOUS':
        return '#9C27B0'; // Purple
      default:
        return '#36A2EB'; // Blue
    }
  }

  static async sendTeamAnalytics(teamName: string, analytics: any) {
    if (!this.webhookUrl) {
      console.log('Slack webhook not configured');
      return;
    }

    const message = this.formatAnalyticsMessage(teamName, analytics);
    
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          attachments: [
            {
              color: '#36A2EB',
              title: `${teamName} Team Analytics`,
              fields: [
                {
                  title: 'Total Recognitions',
                  value: analytics.totalRecognitions.toString(),
                  short: true
                },
                {
                  title: 'Public Recognitions',
                  value: analytics.publicRecognitions.toString(),
                  short: true
                },
                {
                  title: 'Private Recognitions',
                  value: analytics.privateRecognitions.toString(),
                  short: true
                },
                {
                  title: 'Anonymous Recognitions',
                  value: analytics.anonymousRecognitions.toString(),
                  short: true
                }
              ],
              footer: 'Employee Recognition System - Analytics'
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to send Slack analytics:', error);
    }
  }

  private static formatAnalyticsMessage(teamName: string, analytics: any): string {
    return `📊 *${teamName} Team Analytics Report*\n\n` +
           `• Total Recognitions: ${analytics.totalRecognitions}\n` +
           `• Public: ${analytics.publicRecognitions}\n` +
           `• Private: ${analytics.privateRecognitions}\n` +
           `• Anonymous: ${analytics.anonymousRecognitions}\n\n` +
           `Keep up the great work! 🎉`;
  }
}
