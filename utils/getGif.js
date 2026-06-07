import fetch from 'node-fetch';

const NEKOS_BEST_API = 'https://nekos.best/api/v2/';
const WAIFU_PICS_API = 'https://api.waifu.pics/sfw/';

export async function getAnimeGif(action) {
  try {
    const response = await fetch(`${NEKOS_BEST_API}${action}`);
    if (!response.ok) throw new Error('Nekos.best API failed');
    
    const data = await response.json();
    return data.results?.[0]?.url || null;
  } catch (error) {
    try {
      const response = await fetch(`${WAIFU_PICS_API}${action}`);
      if (!response.ok) throw new Error('Waifu.pics API failed');
      
      const data = await response.json();
      return data.url || null;
    } catch (fallbackError) {
      console.error(`Failed to fetch GIF for ${action}:`, fallbackError.message);
      return null;
    }
  }
}

export async function getRandomGif(actions) {
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  return await getAnimeGif(randomAction);
}
