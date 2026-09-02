'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          fetchNotifications();
        }}
        className="btn btn-ghost btn-icon"
        style={{ position: 'relative' }}
        aria-label="View notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--ai-primary)',
            }}
          />
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        description="Real-time alerts and AI engine events"
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', gap: 4 }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 24, fontSize: '0.875rem' }}>
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  background: n.isRead ? 'var(--bg-tertiary)' : 'var(--ai-bg)',
                  border: n.isRead ? '1px solid var(--border-secondary)' : '1px solid var(--ai-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{n.title}</p>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                    {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.message}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
};
