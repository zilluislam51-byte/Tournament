
export enum GameType {
  FREE_FIRE = 'Free Fire',
  LUDO = 'Ludo King',
  BGMI = 'BGMI',
  VALORANT = 'Valorant'
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  ENTRY_FEE = 'Entry Fee',
  WINNINGS = 'Winnings'
}

export enum PaymentMethod {
  BIKASH = 'Bikash',
  NAGAD = 'Nagad',
  WALLET = 'Wallet Balance'
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  joinedAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: GameType;
  entryFee: number;
  prizePool: number;
  startTime: string;
  participants: number;
  maxParticipants: number;
  status: 'Open' | 'Ongoing' | 'Completed';
  image: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  method?: PaymentMethod;
  accountNumber?: string;
  timestamp: string;
  status: 'Pending' | 'Success' | 'Failed';
}

export interface MatchResult {
  id: string;
  tournamentId: string;
  rank: number;
  player: string;
  winnings: number;
}
