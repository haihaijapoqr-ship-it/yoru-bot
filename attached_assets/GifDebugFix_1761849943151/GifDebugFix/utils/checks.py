import math
from typing import Optional

def calculate_level_from_xp(xp: int) -> int:
    if xp <= 0:
        return 1
    
    level = 1
    while xp >= calculate_xp_for_level(level + 1):
        level += 1
    
    return level

def calculate_xp_for_level(level: int) -> int:
    return int(100 * (level ** 1.5))

def calculate_xp_progress(current_xp: int) -> dict:
    level = calculate_level_from_xp(current_xp)
    xp_for_current = calculate_xp_for_level(level)
    xp_for_next = calculate_xp_for_level(level + 1)
    
    xp_in_level = current_xp - xp_for_current
    xp_needed = xp_for_next - xp_for_current
    
    return {
        'level': level,
        'xp_in_level': xp_in_level,
        'xp_needed': xp_needed,
        'xp_for_next': xp_for_next
    }
