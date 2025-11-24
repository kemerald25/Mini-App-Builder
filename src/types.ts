export interface MiniAppConfig {
  name: string;
  description: string;
  category: 'social' | 'gaming' | 'defi' | 'utility';
  features: string[];
  needsTransaction: boolean;
  needsAgent: boolean;
  agentAddress?: string;
  iconUrl?: string;
  homeUrl: string;
  apiKey?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export type AppType = 'simple' | 'transaction' | 'agent-integrated' | 'game' | 'poll' | 'nft-gallery';

