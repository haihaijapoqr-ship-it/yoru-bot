import aiohttp
import random
from typing import Optional

class AnimeAPIClient:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.waifu_pics_base = "https://api.waifu.pics/sfw"
        self.nekos_best_base = "https://nekos.best/api/v2"
        
        self.category_mapping = {
            'kiss': 'kiss',
            'hug': 'hug',
            'cuddle': 'cuddle',
            'pat': 'pat',
            'handhold': 'handhold',
            'poke': 'poke',
            'bonk': 'bonk',
            'bite': 'bite',
            'lick': 'lick',
            'yeet': 'yeet',
            'blush': 'blush',
            'smile': 'smile',
            'wink': 'wink',
            'wave': 'wave',
            'cry': 'cry',
            'happy': 'happy',
            'slap': 'slap',
            'kick': 'kick',
            'highfive': 'highfive',
            'nom': 'nom',
            'dance': 'dance'
        }
    
    async def _get_session(self) -> aiohttp.ClientSession:
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def get_anime_gif(self, category: str) -> Optional[str]:
        if category not in self.category_mapping:
            return None
        
        api_category = self.category_mapping[category]
        
        try:
            url = await self._fetch_from_waifu_pics(api_category)
            if url:
                return url
        except Exception as e:
            print(f"⚠️  Waifu.pics failed for {category}: {e}")
        
        try:
            url = await self._fetch_from_nekos_best(api_category)
            if url:
                return url
        except Exception as e:
            print(f"⚠️  Nekos.best failed for {category}: {e}")
        
        return None
    
    async def _fetch_from_waifu_pics(self, category: str) -> Optional[str]:
        session = await self._get_session()
        url = f"{self.waifu_pics_base}/{category}"
        
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
            if response.status == 200:
                data = await response.json()
                return data.get('url')
            else:
                print(f"⚠️  Waifu.pics returned status {response.status}")
                return None
    
    async def _fetch_from_nekos_best(self, category: str) -> Optional[str]:
        session = await self._get_session()
        url = f"{self.nekos_best_base}/{category}"
        
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
            if response.status == 200:
                data = await response.json()
                results = data.get('results', [])
                if results and len(results) > 0:
                    return results[0].get('url')
                return None
            else:
                print(f"⚠️  Nekos.best returned status {response.status}")
                return None
    
    async def close(self):
        if self.session and not self.session.closed:
            await self.session.close()
            self.session = None

anime_api = AnimeAPIClient()
