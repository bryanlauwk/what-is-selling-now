export interface ProductTrend {
  rank: number;
  productName: string;
  growth: number;
  trend: string;
  trendData: number[];
  examples: string[];
  suppliers: string[];
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}

export interface TrendData {
  products: ProductTrend[];
  sources: GroundingChunk[];
  insight: string;
}

export type SortableKeys = 'rank' | 'productName' | 'growth';

export interface SortConfig {
  key: SortableKeys;
  direction: 'ascending' | 'descending';
}