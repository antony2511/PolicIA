export interface User {
  name: string;
  rank: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'report' | 'ticket' | 'act';
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  date: string; // e.g., "Hoy", "Ayer", "25 de Julio"
}

export enum AppRoute {
  SPLASH = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/dashboard',
  CHAT = '/chat',
  HISTORY = '/history',
  PLANS = '/plans',
  PDF_VIEWER = '/pdf-viewer'
}