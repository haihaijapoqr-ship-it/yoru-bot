import os
import re
from typing import Optional

def get_token() -> Optional[str]:
    token = os.environ.get('DISCORD_TOKEN')
    
    if not token:
        return None
    
    if len(token) < 50:
        return None
    
    return token

def sanitize_error_message(error_msg: str) -> str:
    token_pattern = r'[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}'
    error_msg = re.sub(token_pattern, '[REDACTED_TOKEN]', error_msg)
    
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    error_msg = re.sub(email_pattern, '[REDACTED_EMAIL]', error_msg)
    
    return error_msg

def check_permissions(bot_user, guild):
    required_permissions = [
        'send_messages',
        'embed_links',
        'attach_files',
        'read_message_history',
        'add_reactions',
        'manage_messages',
        'kick_members',
        'ban_members',
        'moderate_members'
    ]
    
    bot_member = guild.get_member(bot_user.id)
    if not bot_member:
        return {'has_all': False, 'missing_permissions': required_permissions}
    
    missing = []
    for perm in required_permissions:
        if not getattr(bot_member.guild_permissions, perm, False):
            missing.append(perm)
    
    return {
        'has_all': len(missing) == 0,
        'missing_permissions': missing
    }
