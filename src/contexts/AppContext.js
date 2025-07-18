import React, { useState, useEffect, createContext } from 'react';
import { MOCK_DATA } from '../utils/mockData';

export const AppContext = createContext();

const getInitialState = (key, defaultValue) => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return defaultValue;
    }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => getInitialState('rigflow_user', null));
  const [page, setPage] = useState('dashboard');
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState(() => getInitialState('rigflow_theme', 'light'));
  
  const [appData, setAppData] = useState(MOCK_DATA);

  useEffect(() => {
    try {
      window.localStorage.setItem('rigflow_user', JSON.stringify(user));
    } catch (error) {
      console.error("Error writing user to localStorage", error);
    }
  }, [user]);

  useEffect(() => {
    try {
        document.documentElement.className = theme;
        window.localStorage.setItem('rigflow_theme', JSON.stringify(theme));
    } catch (error) {
        console.error("Error writing theme to localStorage", error);
    }
  }, [theme]);

  const showNotification = (message, type = 'success', duration = 4000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };
  
  const login = (userId) => {
    setLoading(true);
    setTimeout(() => {
      const foundUser = appData.users.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setPage('dashboard');
        showNotification(`Welcome back, ${foundUser.name.split(' ')[0]}!`);
      } else {
        showNotification('User not found.', 'danger');
      }
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setPage('login');
    showNotification('You have been logged out.', 'info');
  };

  const navigate = (newPage, data = null) => {
    setPage(newPage);
    setPageData(data);
  };

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  
  const addSubmission = (itemType, newItem) => {
    setAppData(prev => ({ ...prev, [itemType]: [...prev[itemType], newItem] }));
  };

  const updateSubmission = (itemType, itemId, updatedData, auditLogEntry = null) => {
    setAppData(prev => {
        const updatedItems = prev[itemType].map(item => {
            if (item.id === itemId) {
                const newAuditLog = auditLogEntry && item.auditLog 
                    ? [...item.auditLog, auditLogEntry] 
                    : item.auditLog;
                return { ...item, ...updatedData, auditLog: newAuditLog || item.auditLog };
            }
            return item;
        });
        return { ...prev, [itemType]: updatedItems };
    });
  };

  const updateApprovalStatus = (itemType, itemId, newStatus, reason = null) => {
    setAppData(prev => {
        const updatedItems = prev[itemType].map(item => {
            if (item.id === itemId) {
                const updatedItem = { ...item, status: newStatus };
                if (newStatus === 'Rejected' && reason) {
                    updatedItem.rejectionReason = reason;
                }
                return updatedItem;
            }
            return item;
        });
        return { ...prev, [itemType]: updatedItems };
    });
    showNotification(`${itemType.slice(0, -1)} #${itemId} has been ${newStatus.toLowerCase()}.`, 'info');
  };

  const createFieldTicket = (ticketData) => {
    const newTicket = {
        ...ticketData,
        id: `ft_${Date.now()}`,
        status: 'Pending Signature',
        createdBy: user.id,
        invoiced: false,
    };
    addSubmission('fieldTickets', newTicket);
    showNotification(`Field Ticket ${newTicket.id} created.`, 'success');
  };
  
  const createInvoice = (invoiceData) => {
    const newInvoice = {
        ...invoiceData,
        id: `inv_2025_${(appData.invoices.length + 1).toString().padStart(3, '0')}`,
        status: 'Issued',
        date: new Date().toISOString().split('T')[0],
        createdBy: user.id,
    };
    setAppData(prev => {
        const updatedTickets = prev.fieldTickets.map(t => 
            invoiceData.fieldTicketIds.includes(t.id) ? { ...t, invoiced: true } : t
        );
        return { ...prev, invoices: [...prev.invoices, newInvoice], fieldTickets: updatedTickets };
    });
    showNotification(`Invoice ${newInvoice.id} has been created.`, 'success');
  };

  const getJobCosts = (jobId) => {
    const jobTimesheets = appData.timesheets.filter(t => t.jobId === jobId && t.status === 'Approved');
    const jobExpenses = appData.expenses.filter(e => e.jobId === jobId && e.status === 'Approved');

    const laborCost = jobTimesheets.reduce((acc, ts) => {
        const user = appData.users.find(u => u.id === ts.userId);
        const hours = ts.dayHours + ts.nightHours;
        return acc + (hours * (user?.rate || 0));
    }, 0);

    const expenseCost = jobExpenses.reduce((acc, ex) => acc + ex.amount, 0);

    return { laborCost, expenseCost, totalCost: laborCost + expenseCost };
  }

  const value = { 
    user, 
    page,
    pageData,
    loading, 
    notification, 
    theme, 
    login, 
    logout, 
    navigate, 
    showNotification, 
    toggleTheme, 
    addSubmission,
    updateSubmission,
    updateApprovalStatus,
    createFieldTicket,
    createInvoice,
    getJobCosts,
    ...appData 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
