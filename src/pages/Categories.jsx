import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, X, Tag, Pencil } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, initialData }) => {
    const { addCategory, updateCategory } = useFinance();
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        color: 'bg-slate-500'
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', type: 'expense', color: 'bg-slate-500' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        if (initialData) {
            updateCategory({ ...formData, id: initialData.id });
        } else {
            addCategory(formData);
        }
        onClose();
        setFormData({ name: '', type: 'expense', color: 'bg-slate-500' });
    };

    const colors = [
        'bg-slate-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500',
        'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-500',
        'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
        'bg-pink-500', 'bg-rose-500'
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Category' : 'Add Category'}</h2>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50 focus:bg-white"
                            placeholder="e.g., Groceries, Salary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Color</label>
                        <div className="grid grid-cols-6 gap-2">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: c })}
                                    className={`w-8 h-8 rounded-full ${c} ${formData.color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5 mt-2 active:scale-[0.98]"
                    >
                        {initialData ? 'Update Category' : 'Add Category'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Categories = () => {
    const { categories, deleteCategory } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [filter, setFilter] = useState('all');

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const filteredCategories = categories.filter(c => {
        if (filter === 'all') return true;
        return c.type === filter;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Categories</h1>
                    <p className="text-slate-500 mt-1">Manage transaction categories.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCategories.map(category => (
                    <div key={category.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white shadow-sm`}>
                                <Tag size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{category.name}</h3>
                                <p className="text-xs text-slate-500 capitalize">{category.type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(category)}
                                className="text-slate-300 hover:text-primary-500 transition-colors p-2 hover:bg-primary-50 rounded-lg"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => deleteCategory(category.id)}
                                className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleClose}
                initialData={editingCategory}
            />
        </div>
    );
};

export default Categories;
