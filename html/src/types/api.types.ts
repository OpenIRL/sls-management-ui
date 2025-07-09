// API response types for SRT Live Server

export interface StreamId {
  publisher: string;
  player: string;
  description?: string;
}

export interface PublisherStats {
  bitrate: number;
  buffer: number;
  dropped_pkts: number;
  latency: number;
  rtt: number;
  uptime: number;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface StatsResponse {
  status: string;
  publisher?: PublisherStats;
}

export interface ApiError {
  status: 'error';
  message: string;
} 