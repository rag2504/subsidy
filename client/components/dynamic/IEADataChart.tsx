import React, { useEffect, useRef } from 'react';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { IEAData } from '@/lib/api';

interface IEADataChartProps {
  data: IEAData[];
  loading?: boolean;
  error?: boolean;
  className?: string;
}

export default function IEADataChart({ data, loading = false, error = false, className = '' }: IEADataChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || loading || error || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 300 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, 300);

    // Sort data by year
    const sortedData = [...data].sort((a, b) => a.year - b.year);
    
    // Separate historical and forecast data
    const currentYear = new Date().getFullYear();
    const historicalData = sortedData.filter(d => d.year <= currentYear);
    const forecastData = sortedData.filter(d => d.year > currentYear);

    // Calculate scales
    const minYear = Math.min(...sortedData.map(d => d.year));
    const maxYear = Math.max(...sortedData.map(d => d.year));
    const maxValue = Math.max(...sortedData.map(d => d.value));
    
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = 300 - padding * 2;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (years)
    for (let i = 0; i <= 5; i++) {
      const x = padding + (chartWidth / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Draw historical data line
    if (historicalData.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      historicalData.forEach((point, index) => {
        const x = padding + ((point.year - minYear) / (maxYear - minYear)) * chartWidth;
        const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }

    // Draw forecast data line (dashed)
    if (forecastData.length > 0) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      // Connect from last historical point to first forecast point
      if (historicalData.length > 0 && forecastData.length > 0) {
        const lastHistorical = historicalData[historicalData.length - 1];
        const firstForecast = forecastData[0];
        
        const x1 = padding + ((lastHistorical.year - minYear) / (maxYear - minYear)) * chartWidth;
        const y1 = padding + chartHeight - (lastHistorical.value / maxValue) * chartHeight;
        const x2 = padding + ((firstForecast.year - minYear) / (maxYear - minYear)) * chartWidth;
        const y2 = padding + chartHeight - (firstForecast.value / maxValue) * chartHeight;
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      
      // Draw forecast line
      forecastData.forEach((point, index) => {
        const x = padding + ((point.year - minYear) / (maxYear - minYear)) * chartWidth;
        const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw data points
    sortedData.forEach(point => {
      const x = padding + ((point.year - minYear) / (maxYear - minYear)) * chartWidth;
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
      
      // Different colors for historical vs forecast
      const isForecast = point.year > currentYear;
      ctx.fillStyle = isForecast ? '#f59e0b' : '#10b981';
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    // X-axis labels (years)
    for (let i = 0; i <= 5; i++) {
      const year = minYear + Math.round((maxYear - minYear) / 5 * i);
      const x = padding + (chartWidth / 5) * i;
      ctx.fillText(year.toString(), x, padding + chartHeight + 20);
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const value = Math.round((maxValue / 4) * i);
      const y = padding + (chartHeight / 4) * (4 - i);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

  }, [data, loading, error]);

  if (loading) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">IEA Hydrogen Data</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">IEA Hydrogen Data</h3>
        </div>
        <div className="flex items-center justify-center h-64 text-red-400">
          Failed to load IEA data
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 rounded-2xl ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">IEA Hydrogen Data</h3>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Historical & Forecasting Data</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Historical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-400">Forecast</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-full" 
          style={{ height: '300px' }}
        />
      </div>

      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <p className="text-gray-400">Total Data Points</p>
            <p className="text-white font-semibold">{data.length}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <p className="text-gray-400">Latest Value</p>
            <p className="text-white font-semibold">
              {Math.round(data[data.length - 1]?.value || 0)} {data[data.length - 1]?.unit || ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
