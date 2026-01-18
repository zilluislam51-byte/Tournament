
import React from 'react';
import { Tournament } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: (id: string) => void;
  isJoined: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onJoin, isJoined }) => {
  const progress = (tournament.participants / tournament.maxParticipants) * 100;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500/50 transition-all group shadow-lg">
      <div className="relative h-48">
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-indigo-600 px-2 py-1 rounded text-xs font-bold font-orbitron">
          {tournament.game}
        </div>
        <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${tournament.status === 'Open' ? 'bg-green-600' : 'bg-gray-600'}`}>
          {tournament.status}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 truncate">{tournament.title}</h3>
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Prize Pool</p>
            <p className="text-xl font-bold text-yellow-500">₹{tournament.prizePool}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Entry Fee</p>
            <p className="text-lg font-bold text-indigo-400">₹{tournament.entryFee}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Players Joined</span>
            <span className="text-white font-medium">{tournament.participants}/{tournament.maxParticipants}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          disabled={isJoined || tournament.status !== 'Open'}
          onClick={() => onJoin(tournament.id)}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            isJoined 
              ? 'bg-green-600/20 text-green-500 border border-green-500/50 cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
          }`}
        >
          {isJoined ? 'Joined' : 'Join Now'}
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
