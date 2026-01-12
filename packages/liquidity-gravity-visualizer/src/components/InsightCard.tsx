interface Insight {
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
}

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const styles = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300'
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-300'
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      iconColor: 'text-green-400',
      titleColor: 'text-green-300'
    }
  };

  const style = styles[insight.type];

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-5`}>
      <div className="flex items-start gap-3">
        <div className={`${style.iconColor} flex-shrink-0 mt-0.5`}>
          {icons[insight.type]}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-semibold ${style.titleColor} mb-1`}>
            {insight.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {insight.message}
          </p>
        </div>
      </div>
    </div>
  );
}

