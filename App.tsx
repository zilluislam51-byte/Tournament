
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, Tournament, Transaction, TransactionType, GameType, PaymentMethod } from './types';
import { MOCK_TOURNAMENTS } from './constants';
import Navbar from './components/Navbar';
import TournamentCard from './components/TournamentCard';
import { getGameStrategy, getSupportResponse } from './services/geminiService';

// --- Dashboard Component ---
const Dashboard: React.FC<{ 
  user: User; 
  onJoinTournament: (id: string) => void;
  joinedIds: string[];
}> = ({ user, onJoinTournament, joinedIds }) => {
  const [filter, setFilter] = useState<string>('All');
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loadingStrategies, setLoadingStrategies] = useState(false);

  useEffect(() => {
    const fetchStrat = async () => {
      setLoadingStrategies(true);
      const data = await getGameStrategy(filter === 'All' ? 'Battle Royale' : filter);
      setStrategies(data);
      setLoadingStrategies(false);
    };
    fetchStrat();
  }, [filter]);

  const filteredTournaments = filter === 'All' 
    ? MOCK_TOURNAMENTS 
    : MOCK_TOURNAMENTS.filter(t => t.game === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">Welcome Back, {user.username}!</h1>
          <p className="text-indigo-100 max-w-md">Join elite tournaments, compete with the best, and win real cash prizes daily.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {['All', GameType.FREE_FIRE, GameType.LUDO].map(game => (
          <button
            key={game}
            onClick={() => setFilter(game)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              filter === game 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTournaments.map(t => (
              <TournamentCard 
                key={t.id} 
                tournament={t} 
                onJoin={onJoinTournament}
                isJoined={joinedIds.includes(t.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="text-lg font-orbitron font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              AI PRO TIPS
            </h2>
            {loadingStrategies ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-800 rounded-xl"></div>)}
              </div>
            ) : (
              <div className="space-y-4">
                {strategies.map((s, idx) => (
                  <div key={idx} className="bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-indigo-500/30 transition-colors">
                    <p className="font-bold text-sm text-indigo-400 mb-1">{s.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Wallet Component ---
const Wallet: React.FC<{
  user: User;
  transactions: Transaction[];
  onDeposit: (amount: number, method: PaymentMethod, accountNumber: string) => void;
  onWithdraw: (amount: number, method: PaymentMethod, accountNumber: string) => void;
}> = ({ user, transactions, onDeposit, onWithdraw }) => {
  const [amount, setAmount] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.BIKASH);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val <= 0) return alert("Please enter a valid amount.");
    if (!accountNumber) return alert("Please enter your account number.");

    if (activeTab === 'deposit') {
      onDeposit(val, method, accountNumber);
    } else {
      onWithdraw(val, method, accountNumber);
    }
    setAmount('');
    setAccountNumber('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 p-8 rounded-3xl shadow-xl border border-indigo-500/20">
          <p className="text-indigo-100/70 uppercase tracking-widest text-sm mb-1">Available Balance</p>
          <h2 className="text-5xl font-orbitron font-bold text-white mb-6">₹{user.balance.toLocaleString()}</h2>
          <div className="flex bg-gray-800/50 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeTab === 'deposit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Deposit
            </button>
            <button 
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeTab === 'withdraw' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setMethod(PaymentMethod.BIKASH)}
                  className={`py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${method === PaymentMethod.BIKASH ? 'border-pink-600 bg-pink-600/10 text-pink-500' : 'border-gray-800 bg-gray-800 text-gray-400'}`}
                >
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  Bikash
                </button>
                <button 
                  type="button"
                  onClick={() => setMethod(PaymentMethod.NAGAD)}
                  className={`py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${method === PaymentMethod.NAGAD ? 'border-orange-600 bg-orange-600/10 text-orange-500' : 'border-gray-800 bg-gray-800 text-gray-400'}`}
                >
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Nagad
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">{method} Number</label>
              <input 
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl py-3 px-4 focus:border-indigo-500 outline-none transition-all text-white font-medium"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input 
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl py-3 pl-8 pr-4 text-xl font-orbitron focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 text-white ${activeTab === 'deposit' ? 'bg-green-600 hover:bg-green-500 shadow-green-600/10' : 'bg-red-600 hover:bg-red-500 shadow-red-600/10'}`}
            >
              Confirm {activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </button>
          </form>
          <p className="mt-4 text-[10px] text-gray-500 text-center">* Transactions are usually processed within 30 minutes.</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <span className="text-xs text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">Last 10 Transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Method & ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No activity recorded yet.</td>
                </tr>
              ) : (
                transactions.slice().reverse().map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium flex items-center gap-2">
                          {tx.method === PaymentMethod.BIKASH && <span className="w-2 h-2 rounded-full bg-pink-500"></span>}
                          {tx.method === PaymentMethod.NAGAD && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
                          {tx.method || 'Internal'}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">#{tx.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                        tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WINNINGS ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-orbitron font-bold">₹{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Support Component ---
const Support: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hi! I am ArenaBot. How can I help you today? You can ask about deposits, tournament rules, or how to join a match.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setQuery('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    const response = await getSupportResponse(userMsg);
    setChat(prev => [...prev, { role: 'bot', text: response || 'Sorry, I missed that.' }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden h-[600px] flex flex-col shadow-2xl">
        <div className="p-6 bg-indigo-900/20 border-b border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl">AI</div>
          <div>
            <h2 className="font-bold">ArenaBot Support</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Always Online
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                  : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700 shadow-lg'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none animate-pulse text-gray-400">Thinking...</div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            />
            <button 
              onClick={handleSend}
              className="bg-indigo-600 p-3 rounded-xl hover:bg-indigo-500 transition-colors"
            >
              <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [joinedTournaments, setJoinedTournaments] = useState<string[]>([]);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.username && authForm.email) {
      setUser({
        id: 'user_1',
        username: authForm.username,
        email: authForm.email,
        balance: 100, // Starting bonus
        joinedAt: new Date().toISOString()
      });
    }
  };

  const onJoinTournament = useCallback((id: string) => {
    const t = MOCK_TOURNAMENTS.find(x => x.id === id);
    if (!t || !user) return;
    if (user.balance < t.entryFee) {
      alert("Insufficient Balance! Please deposit funds using Bikash or Nagad.");
      return;
    }

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: TransactionType.ENTRY_FEE,
      amount: t.entryFee,
      method: PaymentMethod.WALLET,
      timestamp: new Date().toISOString(),
      status: 'Success'
    };

    setTransactions(prev => [...prev, newTx]);
    setJoinedTournaments(prev => [...prev, id]);
    setUser(prev => prev ? { ...prev, balance: prev.balance - t.entryFee } : null);
    alert(`Successfully joined ${t.title}! Room ID will be provided 15 mins before start.`);
  }, [user]);

  const onDeposit = (amount: number, method: PaymentMethod, accountNumber: string) => {
    if (amount <= 0 || !user) return;
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: TransactionType.DEPOSIT,
      amount: amount,
      method,
      accountNumber,
      timestamp: new Date().toISOString(),
      status: 'Success'
    };
    setTransactions(prev => [...prev, tx]);
    setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
    alert(`₹${amount} deposited successfully via ${method}!`);
  };

  const onWithdraw = (amount: number, method: PaymentMethod, accountNumber: string) => {
    if (!user || amount <= 0) return;
    if (user.balance < amount) {
      alert("Insufficient balance for withdrawal.");
      return;
    }
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: TransactionType.WITHDRAWAL,
      amount: amount,
      method,
      accountNumber,
      timestamp: new Date().toISOString(),
      status: 'Success'
    };
    setTransactions(prev => [...prev, tx]);
    setUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    alert(`Withdrawal request of ₹${amount} to ${method} (${accountNumber}) submitted successfully!`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://picsum.photos/id/1067/1920/1080?grayscale&blur=5')] bg-cover">
        <div className="bg-gray-900/95 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md border border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-orbitron font-bold text-white mb-2">GAMEARENA<span className="text-indigo-500">PRO</span></h1>
            <p className="text-gray-400">{isRegistering ? 'Create your elite gaming account' : 'Welcome back, champion!'}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
              <input 
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                placeholder="ProGamer99"
                value={authForm.username}
                onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
              />
            </div>
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                  placeholder="name@example.com"
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                required
                type="password"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              />
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all">
              {isRegistering ? 'Register & Get ₹100 Bonus' : 'Start Playing'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isRegistering ? 'Already have an account?' : 'New to GameArena?'} 
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-1 text-indigo-400 font-bold hover:underline"
            >
              {isRegistering ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar 
          username={user.username} 
          balance={user.balance} 
          onLogout={() => setUser(null)}
          onWalletClick={() => window.location.hash = '#/wallet'}
        />

        <main className="flex-1 pb-24 md:pb-8">
          <Routes>
            <Route path="/dashboard" element={
              <Dashboard 
                user={user} 
                onJoinTournament={onJoinTournament}
                joinedIds={joinedTournaments}
              />
            } />
            <Route path="/wallet" element={
              <Wallet 
                user={user} 
                transactions={transactions}
                onDeposit={onDeposit}
                onWithdraw={onWithdraw}
              />
            } />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 flex justify-around items-center p-3 z-50">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 group">
            <div className="p-2 group-hover:bg-gray-800 rounded-xl transition-all">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Home</span>
          </Link>
          <Link to="/wallet" className="flex flex-col items-center gap-1 group">
            <div className="p-2 group-hover:bg-gray-800 rounded-xl transition-all">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Wallet</span>
          </Link>
          <Link to="/support" className="flex flex-col items-center gap-1 group">
            <div className="p-2 group-hover:bg-gray-800 rounded-xl transition-all">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Support</span>
          </Link>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
