import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, Tags } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            active
                ? "bg-primary-50 text-primary-700 font-semibold shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )}
    >
        <Icon size={20} className={clsx(active ? "text-primary-600" : "text-slate-400")} />
        <span>{label}</span>
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/transactions', icon: Receipt, label: 'Transactions' },
        { to: '/accounts', icon: Wallet, label: 'Accounts' },
        { to: '/categories', icon: Tags, label: 'Categories' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10 shadow-sm">
                <div className="p-6">
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-2xl tracking-tight">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-lg flex items-center justify-center text-white shadow-md shadow-primary-200">
                            <Wallet size={18} />
                        </div>
                        FinTrack
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.to}
                            {...item}
                            active={location.pathname === item.to}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white shadow-lg shadow-primary-200">
                        <p className="text-xs text-primary-200 font-medium mb-1 uppercase tracking-wider">Daily Tip</p>
                        <p className="text-sm font-medium leading-relaxed">Track every penny to save more!</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={clsx(
                            "flex flex-col items-center p-2 rounded-xl w-16 transition-colors",
                            location.pathname === item.to ? "text-primary-600 bg-primary-50" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        <item.icon size={24} strokeWidth={location.pathname === item.to ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-1">{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
