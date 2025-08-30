import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { apiUtils } from '@/lib/api';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  error?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  loading = false,
  error = false,
  onClick,
  className = '',
}: DashboardCardProps) {
  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4 text-gray-400" />;
    return trend.isPositive ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    return trend.isPositive ? 'text-green-400' : 'text-red-400';
  };

  const getTrendText = () => {
    if (!trend) return '';
    return `${trend.isPositive ? '+' : ''}${trend.value}%`;
  };

  if (loading) {
    return (
      <div className={`metric-card animate-pulse ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <div className="w-6 h-6 bg-white/20 rounded"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-6 bg-white/20 rounded"></div>
          </div>
        </div>
        <div className="h-4 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`metric-card border-red-500/20 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <div className="w-6 h-6 text-red-400">⚠️</div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-red-400 font-medium">Error loading data</p>
          </div>
        </div>
        <div className="text-red-400 text-sm font-medium">Please try again</div>
      </div>
    );
  }

  return (
    <div 
      className={`metric-card transition-all duration-300 hover:scale-105 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">
            {typeof value === 'number' ? apiUtils.formatNumber(value) : value}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        {subtitle && (
          <span className="text-gray-400 text-sm">{subtitle}</span>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{getTrendText()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
