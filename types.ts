
export interface BreakoutKeyword {
  keyword: string;
  growth: number;
}

export interface ProductTrend {
  rank: number;
  productName: string;
  trendScore: number;
  breakoutKeywords: BreakoutKeyword[];
  suppliers: string[];
  relatedProducts: string[];
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}

export interface StrategicInsights {
  executiveSummary: string;
  marketInsight: string;
  opportunityGaps: string[];
  actionableNextSteps: string[];
}

export interface TrendData {
  products: ProductTrend[];
  sources: GroundingChunk[];
  insights?: StrategicInsights;
}

export type SortableKeys = 'rank' | 'productName' | 'trendScore';

export interface SortConfig {
  key: SortableKeys;
  direction: 'ascending' | 'descending';
}