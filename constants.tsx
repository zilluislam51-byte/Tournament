
import { GameType, Tournament } from './types';

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    title: 'Free Fire Elite Squad',
    game: GameType.FREE_FIRE,
    entryFee: 50,
    prizePool: 5000,
    startTime: '2023-11-20T18:00:00Z',
    participants: 45,
    maxParticipants: 100,
    status: 'Open',
    image: 'https://picsum.photos/seed/ff1/800/400'
  },
  {
    id: '2',
    title: 'Ludo King Masters',
    game: GameType.LUDO,
    entryFee: 20,
    prizePool: 1000,
    startTime: '2023-11-21T14:00:00Z',
    participants: 12,
    maxParticipants: 32,
    status: 'Open',
    image: 'https://picsum.photos/seed/ludo1/800/400'
  },
  {
    id: '3',
    title: 'Ludo Weekend Blitz',
    game: GameType.LUDO,
    entryFee: 10,
    prizePool: 400,
    startTime: '2023-11-22T10:00:00Z',
    participants: 8,
    maxParticipants: 16,
    status: 'Open',
    image: 'https://picsum.photos/seed/ludo2/800/400'
  },
  {
    id: '4',
    title: 'FF Pro League - Night',
    game: GameType.FREE_FIRE,
    entryFee: 100,
    prizePool: 15000,
    startTime: '2023-11-20T21:00:00Z',
    participants: 90,
    maxParticipants: 100,
    status: 'Open',
    image: 'https://picsum.photos/seed/ff2/800/400'
  }
];
