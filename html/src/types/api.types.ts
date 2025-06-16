// API response types for SRT Live Server

export interface StreamId {
  publisher: string;
  player: string;
  description?: string;
}

export interface PublisherStats {
  bitrate: number;
  bytesRcvDrop: number;
  bytesRcvLoss: number;
  latency: number;
  mbpsBandwidth: number;
  mbpsRecvRate: number;
  msRcvBuf: number;
  pktRcvDrop: number;
  pktRcvLoss: number;
  rtt: number;
  uptime: number;
}

export interface ServerConfig {
  listen_publisher: number;
  listen_player: number;
  http_port: number;
  latency: number;
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
  publishers: Record<string, PublisherStats>;
}

export interface ApiError {
  status: 'error';
  message: string;
} 