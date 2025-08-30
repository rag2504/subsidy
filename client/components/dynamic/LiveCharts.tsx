import React, { useEffect, useRef } from 'react';
import { LineChart, BarChart3, TrendingUp, Activity } from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

interface LiveChartsProps {
  type: 'line' | 'bar' | 'area';
  data: ChartData;
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: boolean;
  height?: number;
  className?: string;
}

export default function LiveCharts({
  type,
  data,
  title,
  subtitle,
  loading = false,
  error = false,
  height = 300,
  className = '',
}: LiveChartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || loading || error) return;

    // Simple chart implementation using Canvas API
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.offsetWidth - padding * 2;
    const chartHeight = height - padding * 2;

    // Find data range
    const allData = data.datasets.flatMap(dataset => dataset.data);
    const minValue = Math.min(...allData);
    const maxValue = Math.max(...allData);
    const range = maxValue - minValue;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= data.labels.length; i++) {
      const x = padding + (i / data.labels.length) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.offsetWidth - padding, y);
      ctx.stroke();
    }

    // Draw data
    data.datasets.forEach((dataset, datasetIndex) => {
      const points = dataset.data.map((value, index) => ({
        x: padding + (index / (data.labels.length - 1)) * chartWidth,
        y: height - padding - ((value - minValue) / range) * chartHeight,
      }));

      if (type === 'line' || type === 'area') {
        // Draw line
        ctx.strokeStyle = dataset.borderColor || '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();

        // Fill area if needed
        if (type === 'area' && dataset.fill) {
          ctx.fillStyle = dataset.backgroundColor || 'rgba(16, 185, 129, 0.1)';
          ctx.lineTo(points[points.length - 1].x, height - padding);
          ctx.lineTo(points[0].x, height - padding);
          ctx.closePath();
          ctx.fill();
        }

        // Draw points
        ctx.fillStyle = dataset.borderColor || '#10b981';
        points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      } else if (type === 'bar') {
        // Draw bars
        const barWidth = chartWidth / data.labels.length * 0.8;
        const barSpacing = chartWidth / data.labels.length * 0.2;

        ctx.fillStyle = dataset.backgroundColor || '#10b981';
        points.forEach((point, index) => {
          const barHeight = height - padding - point.y;
          const barX = point.x - barWidth / 2;
          const barY = point.y;

          ctx.fillRect(barX, barY, barWidth, barHeight);
        });
      }
    });

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, index) => {
      const x = padding + (index / (data.labels.length - 1)) * chartWidth;
      ctx.fillText(label, x, height - padding + 20);
    });

    // Draw value labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (i / 5) * range;
      const y = padding + (i / 5) * chartHeight;
      ctx.fillText(value.toLocaleString(), padding - 10, y + 4);
    }

  }, [data, type, height, loading, error]);

  if (loading) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/10 rounded"></div>
            <div>
              <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-24"></div>
            </div>
          </div>
          <div className="h-64 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-red-400">⚠️</div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Chart Error</h3>
          <p className="text-gray-400">Failed to load chart data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 rounded-2xl ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
          {type === 'line' && <LineChart className="w-4 h-4 text-white" />}
          {type === 'bar' && <BarChart3 className="w-4 h-4 text-white" />}
          {type === 'area' && <TrendingUp className="w-4 h-4 text-white" />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-medium">Live</span>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: `${height}px` }}
        />
        
        {/* Chart overlay for interactions */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Add tooltips and interactions here */}
        </div>
      </div>
    </div>
  );
}

// Predefined chart configurations
export const chartConfigs = {
  // Subsidy disbursement trend
  subsidyTrend: {
    type: 'line' as const,
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Subsidy Released',
        data: [1200000, 1800000, 2200000, 2400000, 2800000, 3200000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      }],
    },
    title: 'Subsidy Disbursement Trend',
    subtitle: 'Monthly subsidy release amounts',
  },

  // GH₂ production growth
  gh2Production: {
    type: 'bar' as const,
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'GH₂ Volume (kg)',
        data: [8500, 12400, 16800, 21500],
        backgroundColor: '#3b82f6',
      }],
    },
    title: 'GH₂ Production Growth',
    subtitle: 'Quarterly production volumes',
  },

  // Carbon credits generated
  carbonCredits: {
    type: 'area' as const,
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Carbon Credits',
        data: [12500, 18900, 23400, 28900],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 244, 0.1)',
        fill: true,
      }],
    },
    title: 'Carbon Credits Generated',
    subtitle: 'Weekly carbon credit accumulation',
  },

  // Project status distribution
  projectStatus: {
    type: 'bar' as const,
    data: {
      labels: ['Active', 'Pending', 'Completed', 'Suspended'],
      datasets: [{
        label: 'Projects',
        data: [892, 156, 234, 45],
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
      }],
    },
    title: 'Project Status Distribution',
    subtitle: 'Current project status breakdown',
  },
};

// Hook for real-time chart updates
export function useLiveChartData(initialData: ChartData, updateInterval: number = 5000) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
      setData(prevData => ({
        ...prevData,
        datasets: prevData.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(value => 
            value + (Math.random() - 0.5) * value * 0.1
          ),
        })),
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return data;
}
