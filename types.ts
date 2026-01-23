export interface TimelineEvent {
  timestamp: string;
  action: string;
  observation: string;
  isError: boolean;
}

export interface ArcheologyReport {
  events: TimelineEvent[];
  summary: string;
  thoughtSignature: string; // The raw reasoning state preserved for the next step
}

export interface Solution {
  playwrightScript: string;
  suggestedFix: string;
  explanation: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING', // Gemini 3 Flash
  REPORT_READY = 'REPORT_READY',
  SOLVING = 'SOLVING', // Gemini 3 Pro
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
