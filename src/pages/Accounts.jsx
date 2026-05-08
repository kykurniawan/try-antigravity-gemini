import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Wallet, CreditCard, Banknote, X, Pencil } from 'lucide-react';

const AccountModal = ({ isOpen, onClose, initialData }) => {
    const { addAccount, updateAccount } = useFinance();
    const [formData, setFormData] = useState({
        name: '',
        type: 'bank',
        balance: ''
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', type: 'bank', balance: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        if (initialData) {
            updateAccount({ ...formData, id: initialData.id });
        } else {
            addAccount(formData);
        }
        onClose();
        setFormData({ name: '', type: 'bank', balance: '' });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Account' : 'Add Account'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white"
                            placeholder="e.g., Main Bank, Cash"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white appearance-none"
                        >
                            <option value="bank">Bank Account</option>
                            <option value="cash">Cash</option>
                            <option value="credit">Credit Card</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Balance</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary-500 transition-colors">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.balance}
                                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5 mt-2 active:scale-[0.98]"
                    >
                        {initialData ? 'Update Account' : 'Add Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Accounts = () => {
    const { accounts, deleteAccount } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const handleEdit = (account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'cash': return Banknote;
            case 'credit': return CreditCard;
            default: return Wallet;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Accounts</h1>
                    <p className="text-slate-500 mt-1">Manage your bank accounts and wallets.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingAccount(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Add Account
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(account => {
                    const Icon = getIcon(account.type);
                    return (
                        <div key={account.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(account)}
                                    className="text-slate-300 hover:text-primary-500 transition-colors p-2 hover:bg-primary-50 rounded-lg"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    onClick={() => deleteAccount(account.id)}
                                    className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{account.name}</h3>
                                    <p className="text-slate-500 text-sm capitalize">{account.type}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Current Balance</p>
                                <p className="text-3xl font-bold text-slate-900">${account.balance.toLocaleString()}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AccountModal
                isOpen={isModalOpen}
                onClose={handleClose}
                initialData={editingAccount}
            />
        </div>
    );
};

export default Accounts;
