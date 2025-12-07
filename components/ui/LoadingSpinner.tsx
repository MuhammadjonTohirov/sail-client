'use client';

import type { CSSProperties } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

export function LoadingSpinner({
  size = 'medium',
  fullScreen = false,
  message
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const spinnerSize = sizeMap[size];

  const containerStyle: CSSProperties = fullScreen ? {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    gap: '16px',
  };

  const spinnerStyle: CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: '3px solid #f3f3f3',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spinner-rotate 0.8s linear infinite',
  };

  const textStyle: CSSProperties = {
    color: 'var(--muted)',
    fontSize: '14px',
    fontWeight: 500,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
      <div style={containerStyle}>
        <div style={spinnerStyle} />
        {message && <p style={textStyle}>{message}</p>}
      </div>
    </>
  );
}
