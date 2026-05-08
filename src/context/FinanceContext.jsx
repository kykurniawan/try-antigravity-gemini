import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

const DEFAULT_CATEGORIES = [
    { id: 'c1', name: 'Salary', type: 'income', color: 'bg-emerald-500' },
    { id: 'c2', name: 'Freelance', type: 'income', color: 'bg-teal-500' },
    { id: 'c3', name: 'Food', type: 'expense', color: 'bg-orange-500' },
    { id: 'c4', name: 'Transport', type: 'expense', color: 'bg-blue-500' },
    { id: 'c5', name: 'Utilities', type: 'expense', color: 'bg-yellow-500' },
    { id: 'c6', name: 'Entertainment', type: 'expense', color: 'bg-purple-500' },
    { id: 'c7', name: 'Shopping', type: 'expense', color: 'bg-pink-500' },
    { id: 'c8', name: 'Health', type: 'expense', color: 'bg-red-500' },
];

const DEFAULT_ACCOUNTS = [
    { id: 'a1', name: 'Cash', type: 'cash', balance: 0, color: 'bg-slate-500' },
    { id: 'a2', name: 'Bank Account', type: 'bank', balance: 0, color: 'bg-indigo-500' },
];

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    });

    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('accounts');
        return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
    });

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }, [accounts]);

    const addTransaction = (transaction) => {
        const newTransaction = { ...transaction, id: uuidv4(), date: transaction.date || new Date().toISOString() };
        setTransactions([newTransaction, ...transactions]);

        // Update account balance
        setAccounts(prevAccounts => prevAccounts.map(acc => {
            if (acc.id === transaction.accountId) {
                const amount = parseFloat(transaction.amount);
                const newBalance = transaction.type === 'income'
                    ? acc.balance + amount
                    : acc.balance - amount;
                return { ...acc, balance: newBalance };
            }
            return acc;
        }));
    };

    const deleteTransaction = (id) => {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) return;

        setTransactions(transactions.filter(t => t.id !== id));

        // Revert account balance
        setAccounts(prevAccounts => prevAccounts.map(acc => {
            if (acc.id === transaction.accountId) {
                const amount = parseFloat(transaction.amount);
                const newBalance = transaction.type === 'income'
                    ? acc.balance - amount
                    : acc.balance + amount;
                return { ...acc, balance: newBalance };
            }
            return acc;
        }));
    };

    const addCategory = (category) => {
        setCategories([...categories, { ...category, id: uuidv4() }]);
    };

    const deleteCategory = (id) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const addAccount = (account) => {
        setAccounts([...accounts, { ...account, id: uuidv4(), balance: parseFloat(account.balance) || 0 }]);
    };

    const deleteAccount = (id) => {
        setAccounts(accounts.filter(a => a.id !== id));
    };

    const updateAccount = (updatedAccount) => {
        setAccounts(accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a));
    };

    const updateCategory = (updatedCategory) => {
        setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    };

    const updateTransaction = (updatedTransaction) => {
        const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
        if (!oldTransaction) return;

        // We need to calculate the balance changes carefully.
        // It's easier to just do it in two passes on the accounts array or one complex pass.
        // Let's do it by creating a map of account updates.

        const accountUpdates = {};

        // Revert old transaction
        const oldAmount = parseFloat(oldTransaction.amount);
        if (!accountUpdates[oldTransaction.accountId]) {
            const acc = accounts.find(a => a.id === oldTransaction.accountId);
            if (acc) accountUpdates[oldTransaction.accountId] = acc.balance;
        }

        if (accountUpdates[oldTransaction.accountId] !== undefined) {
            if (oldTransaction.type === 'income') {
                accountUpdates[oldTransaction.accountId] -= oldAmount;
            } else {
                accountUpdates[oldTransaction.accountId] += oldAmount;
            }
        }

        // Apply new transaction
        // Note: We need to use the potentially updated balance from the reversion step if the account is the same.
        const newAmount = parseFloat(updatedTransaction.amount);

        // Ensure we have the latest balance for the new account (if it's different from old account)
        if (accountUpdates[updatedTransaction.accountId] === undefined) {
            const acc = accounts.find(a => a.id === updatedTransaction.accountId);
            if (acc) accountUpdates[updatedTransaction.accountId] = acc.balance;
        }

        if (accountUpdates[updatedTransaction.accountId] !== undefined) {
            if (updatedTransaction.type === 'income') {
                accountUpdates[updatedTransaction.accountId] += newAmount;
            } else {
                accountUpdates[updatedTransaction.accountId] -= newAmount;
            }
        }

        // Apply updates to state
        setAccounts(accounts.map(acc => {
            if (accountUpdates[acc.id] !== undefined) {
                return { ...acc, balance: accountUpdates[acc.id] };
            }
            return acc;
        }));

        setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    };

    return (
        <FinanceContext.Provider value={{
            transactions,
            categories,
            accounts,
            addTransaction,
            deleteTransaction,
            addCategory,
            deleteCategory,
            addAccount,
            deleteAccount,
            updateAccount,
            updateTransaction,
            updateCategory,
        }}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => useContext(FinanceContext);
