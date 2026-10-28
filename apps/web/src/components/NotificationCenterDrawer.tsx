import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  onMarkAllRead: () => void;
}

interface NotificationItem {
  id: string;
  category: 'FEE' | 'ATTENDANCE' | 'ACADEMIC' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'HIGH' | 'NORMAL';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    category: 'FEE',
    title: 'New UTR Submitted for Bursar Reconciliation',
    message: 'Parent of Diya Patel submitted UTR20261026987114 for ₹38,000 (State Bank of India). Balance is frozen pending review.',
    timestamp: '12 mins ago',
    read: false,
    priority: 'HIGH',
  },
  {
    id: 'n-2',
    category: 'ATTENDANCE',
    title: '78% Parent Defaulter Early-Warning Triggered',
    message: 'Diya Patel attendance reached 78.4% (Threshold: 75%). Early warning dispatched via verified In-App push.',
    timestamp: '35 mins ago',
    read: false,
    priority: 'HIGH',
  },
  {
    id: 'n-3',
    category: 'ACADEMIC',
    title: 'Smart Period Substitution Assigned',
    message: 'Dr. Anand Joshi leave registered for Period 3 (CS403). Prof. Sunita Rao assigned with suitability score 94%.',
    timestamp: '1 hour ago',
    read: false,
    priority: 'NORMAL',
  },
  {
    id: 'n-4',
    category: 'SYSTEM',
    title: 'Dual-Signoff Grade Moderation Locked',
    message: 'HOD Computer Science has approved normalized grade adjustments for CS401 semester marksheet batch.',
    timestamp: '3 hours ago',
    read: true,
    priority: 'NORMAL',
  },
];

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose,
  unreadCount,
  onMarkAllRead,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'FEE' | 'ATTENDANCE'>('ALL');

  if (!isOpen) return null;

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead();
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'FEE') return n.category === 'FEE';
    if (activeFilter === 'ATTENDANCE') return n.category === 'ATTENDANCE';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full h-full shadow-2xl border-l border-[#E5DFD7] flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E5DFD7] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#682038]/10 text-[#682038] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#242424]">Real-Time Notification Center</h3>
                <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>WebSocket Connected (/ws/notifications)</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6E6862] hover:bg-[#F4ECE2]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  activeFilter === 'ALL'
                    ? 'bg-[#682038] text-white'
                    : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('UNREAD')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  activeFilter === 'UNREAD'
                    ? 'bg-[#682038] text-white'
                    : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setActiveFilter('FEE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  activeFilter === 'FEE'
                    ? 'bg-[#682038] text-white'
                    : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
                }`}
              >
                Fees
              </button>
              <button
                onClick={() => setActiveFilter('ATTENDANCE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  activeFilter === 'ATTENDANCE'
                    ? 'bg-[#682038] text-white'
                    : 'bg-[#FAF7F2] text-[#6E6862] hover:bg-[#F4ECE2]'
                }`}
              >
                Attendance
              </button>
            </div>

            <button
              onClick={handleMarkAll}
              className="text-[11px] text-[#682038] hover:underline font-bold shrink-0 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E5DFD7]">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`p-4 transition-colors cursor-pointer ${
                  item.read ? 'bg-white hover:bg-[#FAF7F2]/60' : 'bg-[#FAF7F2] hover:bg-[#F4ECE2]/80 border-l-4 border-l-[#682038]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#242424]">{item.title}</span>
                      {item.priority === 'HIGH' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6E6862] leading-relaxed">{item.message}</p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-[#8B5E3C] font-mono">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  {!item.read && <span className="w-2 h-2 rounded-full bg-[#682038] shrink-0 mt-1"></span>}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[#6E6862] space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <p>You are all caught up! No notifications in this category.</p>
            </div>
          )}
        </div>

        {/* Drawer Footer Policy Banner */}
        <div className="p-4 border-t border-[#E5DFD7] bg-[#FAF7F2] text-center space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#682038] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-SMS Cost Optimization Architecture</span>
          </div>
          <p className="text-[11px] text-[#6E6862]">
            Alerts stream via WebSocket in-app push and SMTP email adapters only. SMS / WhatsApp APIs strictly avoided as per specification non-goals.
          </p>
        </div>
      </div>
    </div>
  );
};
