export const actionMessages = {
  kiss: [
    'Sweet bytes of affection.',
    'Connection established... 💞',
    'Data packets of love sent!',
    'Affection.exe running...',
    'Transmitting feelings...'
  ],
  hug: [
    'Warm embrace protocol initiated.',
    'Comfort.sys activated!',
    'Digital warmth shared.',
    'Connection secured with care.',
    'Uploading support...'
  ],
  slap: [
    'System reboot required!',
    'Error 404: Chill not found.',
    'Critical hit detected!',
    'Wake-up call deployed.',
    'Reality check.exe executed!'
  ],
  pat: [
    'Headpat protocol engaged.',
    'Comfort levels rising...',
    'Wholesomeness detected.',
    'Affection module active.',
    'Gentle care administered.'
  ],
  cuddle: [
    'Under a digital sky...',
    'Cozy mode: ACTIVATED',
    'Warmth levels: Maximum',
    'Snuggle protocol running.',
    'Comfort zone established.'
  ],
  blush: [
    'Overheating detected!',
    'Blush.exe crashed successfully.',
    'Temperature rising... 🌡️',
    'Embarrassment levels: CRITICAL',
    'System flustered!'
  ],
  bonk: [
    'Bonk! Back to reality.',
    'Horny jail protocol activated.',
    'Reality check delivered.',
    'Down to earth you go!',
    'Systems recalibrated.'
  ]
};

export const hackMessages = {
  success: [
    'Access granted! You infiltrated Node {node}.',
    'Firewall bypassed! Node {node} compromised.',
    'System breach successful on Node {node}!',
    'Hack complete! Data extracted from Node {node}.',
    'Node {node} is now under your control.'
  ],
  failure: [
    'Access denied! Firewall too strong.',
    'Connection lost... Try again later.',
    'Security detected your presence!',
    'Encryption too complex. Failed to breach.',
    'System defended successfully. Hack failed.'
  ]
};

export const scanMessages = [
  'You scanned the data streams...',
  'Searching through digital ruins...',
  'Analyzing network fragments...',
  'Exploring the cyber wasteland...',
  'Probing the dark web...'
];

const genericMessages = [
  'Action protocol executed.',
  'Command processed successfully.',
  'Data transmitted.',
  'System engaged.',
  'Connection established.',
  'Module activated.',
  'Protocol initiated.',
  'Sequence complete.',
  'Operation successful.',
  'Task executed.'
];

export function getRandomMessage(category) {
  let messages;
  
  if (actionMessages[category]) {
    messages = actionMessages[category];
  } else if (hackMessages[category]) {
    messages = hackMessages[category];
  } else if (category === 'scan') {
    messages = scanMessages;
  } else {
    messages = genericMessages;
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export function formatHackMessage(type, node) {
  const messages = hackMessages[type];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return message.replace('{node}', node);
}
