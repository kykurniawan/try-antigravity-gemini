import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownLeft, Wallet, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { accounts, transactions } = useFinance();

    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    // Calculate income/expense for this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = thisMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const expense = thisMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, here's your financial overview.</p>
                </div>
                <Link to="/transactions" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5">
                    <Plus size={20} />
                    Add Transaction
                </Link>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <span className="text-slate-500 font-medium">Total Balance</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        ${totalBalance.toLocaleString()}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <ArrowUpRight size={24} />
                        </div>
                        <span className="text-slate-500 font-medium">Income (This Month)</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">
                        +${income.toLocaleString()}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                            <ArrowDownLeft size={24} />
                        </div>
                        <span className="text-slate-500 font-medium">Expense (This Month)</span>
                    </div>
                    <div className="text-3xl font-bold text-rose-600">
                        -${expense.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
                    <Link to="/transactions" className="text-primary-600 font-medium hover:text-primary-700 text-sm">View All</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentTransactions.length > 0 ? recentTransactions.map(t => (
                        <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{t.note || 'No description'}</p>
                                    <p className="text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                            </span>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-500">
                            No transactions yet. Start by adding one!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
