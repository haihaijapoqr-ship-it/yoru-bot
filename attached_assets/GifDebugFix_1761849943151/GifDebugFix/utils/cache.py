import time
from typing import Dict, Tuple

class CooldownManager:
    def __init__(self):
        self.cooldowns: Dict[str, Dict[int, float]] = {}
    
    def is_on_cooldown(self, command: str, user_id: int, cooldown_seconds: int) -> Tuple[bool, float]:
        if command not in self.cooldowns:
            self.cooldowns[command] = {}
        
        if user_id not in self.cooldowns[command]:
            return False, 0.0
        
        last_used = self.cooldowns[command][user_id]
        time_passed = time.time() - last_used
        
        if time_passed < cooldown_seconds:
            remaining = cooldown_seconds - time_passed
            return True, remaining
        
        return False, 0.0
    
    def set_cooldown(self, command: str, user_id: int):
        if command not in self.cooldowns:
            self.cooldowns[command] = {}
        
        self.cooldowns[command][user_id] = time.time()
    
    def clear_cooldown(self, command: str, user_id: int):
        if command in self.cooldowns and user_id in self.cooldowns[command]:
            del self.cooldowns[command][user_id]

cooldown_manager = CooldownManager()
