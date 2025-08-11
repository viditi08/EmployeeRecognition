import { RecognitionType } from "./context";

export interface PubSubEvents {
  [event: string]: unknown;
  RECOGNITION_RECEIVED: RecognitionType;
  NOTIFICATION_RECEIVED: any;
  TEAM_RECOGNITION_UPDATE: RecognitionType;
  ANALYTICS_UPDATE: any;
}
