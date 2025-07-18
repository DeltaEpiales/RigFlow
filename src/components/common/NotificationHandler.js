import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationHandler = () => {
  const { notification } = useContext(AppContext);
  if (!notification) return null;

  const icons = { success: <CheckCircle />, danger: <AlertTriangle />, info: <Info /> };
  const colors = { success: 'bg-green-500', danger: 'bg-red-500', info: 'bg-blue-500' };

  return (
    <div className={`fixed top-5 right-5 flex items-center p-4 rounded-lg shadow-lg text-white text-sm font-semibold z-50 no-print ${colors[notification.type]}`}>
      <div className="w-5 h-5 mr-3">{icons[notification.type]}</div>
      {notification.message}
    </div>
  );
};

export default NotificationHandler;
