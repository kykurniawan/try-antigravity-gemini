import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';

function App() {
  return (
    <FinanceProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </Layout>
      </Router>
    </FinanceProvider>
  );
}

export default App;
