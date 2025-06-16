// Generate UUID v4
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

// Generate default stream IDs
export const generateDefaultStreamIds = () => {
  const publisherUuid = generateUUID().replace(/-/g, '');
  const playerUuid = generateUUID().replace(/-/g, '');
  return {
    publisherId: `live_${publisherUuid}`,
    playerId: `play_${playerUuid}`
  };
}; 