// Shared guest/invitation helpers used by the admin link generator and the invitation itself

export const COUPLE = { groom: 'Subash', bride: 'Shehani' };

export const GUEST_PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;

export type GuestEvent = 'both' | 'church' | 'reception';

export const EVENT_OPTIONS: { value: GuestEvent; label: string }[] = [
  { value: 'both', label: 'Church Mass & Reception' },
  { value: 'church', label: 'Church Mass only' },
  { value: 'reception', label: 'Reception only' },
];

export const EVENT_LABELS: Record<GuestEvent, string> = {
  both: 'Church Mass & Reception',
  church: 'The Holy Matrimony',
  reception: 'The Wedding Reception',
};

export function parseEvent(value: string | null | undefined): GuestEvent {
  return value === 'church' || value === 'reception' ? value : 'both';
}

// Combine prefix and name. "Dear" is never part of the name, because greetings already start with "Dear".
export function guestDisplayName(prefix: string, name: string): string {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  switch (prefix) {
    case 'Family':
      return `${n} and Family`;
    case 'Dear':
    case '':
      return n;
    default:
      return `${prefix} ${n}`;
  }
}

// {origin}/{guestName}?title=..&event=..&guests=..
export function buildInviteUrl(origin: string, prefix: string, name: string, event: GuestEvent, guests: string): string {
  const params = new URLSearchParams();
  if (prefix) params.set('title', prefix);
  if (event !== 'both') params.set('event', event);
  if (guests && guests !== '1') params.set('guests', guests);
  const query = params.toString();
  return `${origin}/${encodeURIComponent(name.trim().replace(/\s+/g, ' '))}${query ? `?${query}` : ''}`;
}

// Guest name from the path (/Sanjaya), falling back to the older ?name= links
export function readGuestName(): string {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (path && path !== 'admin') {
    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  }
  return new URLSearchParams(window.location.search).get('name') || '';
}

export function invitationMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${COUPLE.groom} & ${COUPLE.bride}`;
}
