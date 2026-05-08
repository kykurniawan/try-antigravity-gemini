import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Search, Filter, X, Pencil } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, initialData }) => {
    const { addTransaction, updateTransaction, categories, accounts } = useFinance();
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        categoryId: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: initialData.date.split('T')[0]
            });
        } else {
            setFormData({
                type: 'expense',
                amount: '',
                categoryId: '',
                accountId: '',
                date: new Date().toISOString().split('T')[0],
                note: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.accountId || !formData.categoryId) return;

        if (initialData) {
            updateTransaction({ ...formData, id: initialData.id });
        } else {
            addTransaction(formData);
        }
        onClose();
        setFormData({
            type: 'expense',
            amount: '',
            categoryId: '',
            accountId: '',
            date: new Date().toISOString().split('T')[0],
            note: ''
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 scale-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4 p-1 bg-slate-50 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            className={`p-2.5 rounded-lg font-medium text-sm transition-all ${formData.type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            className={`p-2.5 rounded-lg font-medium text-sm transition-all ${formData.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Income
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary-500 transition-colors">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white appearance-none"
                            >
                                <option value="">Select</option>
                                {categories.filter(c => c.type === formData.type).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Account</label>
                            <select
                                required
                                value={formData.accountId}
                                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white appearance-none"
                            >
                                <option value="">Select</option>
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Note</label>
                        <input
                            type="text"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white"
                            placeholder="What was this for?"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5 mt-2 active:scale-[0.98]"
                    >
                        {initialData ? 'Update Transaction' : 'Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Transactions = () => {
    const { transactions, categories, accounts, deleteTransaction } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [filter, setFilter] = useState('all');

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';
    const getAccountName = (id) => accounts.find(a => a.id === id)?.name || 'Unknown';

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transactions</h1>
                    <p className="text-slate-500 mt-1">Manage your income and expenses.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTransaction(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Add New
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
                    {['all', 'income', 'expense'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Note</th>
                                <th className="px-6 py-4">Account</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                            {getCategoryName(t.categoryId)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-900 font-medium">{t.note}</td>
                                    <td className="px-6 py-4 text-slate-500">{getAccountName(t.accountId)}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(t)}
                                                className="text-slate-400 hover:text-primary-500 transition-colors p-2 hover:bg-primary-50 rounded-lg"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteTransaction(t.id)}
                                                className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleClose}
                initialData={editingTransaction}
            />
        </div>
    );
};

export default Transactions;
