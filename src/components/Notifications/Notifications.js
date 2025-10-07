import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import './Notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Notifications = ({ session }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      listenForNewNotifications();
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [session, dropdownRef]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data);
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    }
  };

  const listenForNewNotifications = () => {
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` }, payload => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds);

    if (error) {
      console.error('Error marking notifications as read:', error);
    } else {
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    }
  };

  const handleDelete = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
    } else {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    }
  };

  const handleDeleteAll = async () => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting all notifications:', error);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <div className="notification-icon" onClick={handleToggle}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>
      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>Notificaciones</h4>
            {notifications.length > 0 && (
              <button onClick={handleDeleteAll} className="delete-all-btn">
                Eliminar todas
              </button>
            )}
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${!notification.is_read ? 'unread' : ''}`}>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(notification.id)} className="delete-notification-btn">
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="notification-item">No tienes notificaciones.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;