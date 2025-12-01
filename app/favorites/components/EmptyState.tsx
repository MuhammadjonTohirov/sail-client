'use client';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ color: 'var(--muted)', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--muted)' }}>{description}</p>
    </div>
  );
}
