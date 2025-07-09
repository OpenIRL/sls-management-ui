import config from '../config';

// Extract hostname from API endpoint
const getServerHostname = (): string => {
    try {
        const url = new URL(config.apiEndpoint);
        return url.hostname;
    } catch {
        // Fallback if API endpoint is not a valid URL
        return 'localhost';
    }
};

// Check if a port is configured (not empty and not a placeholder)
const isPortConfigured = (port: string): boolean => {
    return !!(port && port !== '' && !port.includes('{{'));
};

// Generate SRT Player URL
export const generatePlayerUrl = (playerId: string): string => {
    const hostname = getServerHostname();
    const port = config.srtPlayerPort;
    return `srt://${hostname}:${port}?streamid=${playerId}`;
};

// Generate SRT Publisher URL
export const generatePublisherUrl = (publisherId: string): string => {
    const hostname = getServerHostname();
    const port = config.srtSenderPort;
    return `srt://${hostname}:${port}?streamid=${publisherId}`;
};

// Generate SRTLA Publisher URL
export const generateSrtlaPublisherUrl = (publisherId: string): string => {
    const hostname = getServerHostname();
    const port = config.srtlaPort;
    return `srtla://${hostname}:${port}?streamid=${publisherId}`;
};

// Generate Stats URL
export const generateStatsUrl = (playerId: string): string => {
    const hostname = getServerHostname();
    const port = config.slsStatsPort;
    return `http://${hostname}:${port}/stats/${playerId}?legacy=1`;
};

// URL information for display
export interface UrlInfo {
    label: string;
    url: string;
    description: string;
    icon: string;
}

// Get all URLs for a stream
export const getStreamUrls = (streamId: { publisher: string; player: string }): UrlInfo[] => {
    const urls: UrlInfo[] = [
        {
            label: 'SRT Publisher',
            url: generatePublisherUrl(streamId.publisher),
            description: 'Use this URL to publish your stream via SRT',
            icon: 'bi-broadcast'
        }
    ];
    
    // Only add SRTLA URL if SRTLA port is configured
    if (isPortConfigured(config.srtlaPort)) {
        urls.push({
            label: 'SRTLA Publisher',
            url: generateSrtlaPublisherUrl(streamId.publisher),
            description: 'Use this URL to publish your stream via SRTLA (with bonding support)',
            icon: 'bi-broadcast-pin'
        });
    }
    
    urls.push(
        {
            label: 'SRT Player',
            url: generatePlayerUrl(streamId.player),
            description: 'Use this URL to play the stream via SRT',
            icon: 'bi-play-circle'
        },
        {
            label: 'Statistics',
            url: generateStatsUrl(streamId.player),
            description: 'View real-time statistics for this stream',
            icon: 'bi-graph-up'
        }
    );
    
    return urls;
}; 