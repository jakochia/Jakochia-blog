import React from 'react';

const DashboardStats = ({ stats }) => {
  const items = [
    { label: 'Total Posts', value: stats.totalPosts, icon: '📝', color: 'blue' },
    { label: 'Published', value: stats.publishedPosts, icon: '✅', color: 'green' },
    { label: 'Drafts', value: stats.draftPosts, icon: '📄', color: 'amber' },
    { label: 'Total Views', value: stats.totalViews, icon: '👁️', color: 'indigo' },
    { label: 'Pending Comments', value: stats.pendingComments, icon: '💬', color: 'orange' },
    { label: 'Subscribers', value: stats.totalSubscribers, icon: '📧', color: 'teal' },
    { label: 'Projects', value: stats.totalProjects, icon: '🚀', color: 'rose' },
    { label: 'Total Comments', value: stats.totalComments, icon: '🗨️', color: 'cyan' },
  ];

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/20 text-teal-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`bg-gradient-to-br ${colorClasses[item.color]} border rounded-xl p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-glow`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium opacity-80">{item.label}</span>
          </div>
          <p className="text-2xl font-bold mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;