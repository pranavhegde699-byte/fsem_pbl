import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 404 Not Found page for the WorkProof platform.
 * Displayed when users navigate to a non-existent route.
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0F172A 0%, #1E3A5F 55%, #0F2A4A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px',
    }}>
      {/* Background texture dots */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Gradient orb */}
      <div style={{
        position: 'absolute', top: '20%', right: '10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 65%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* 404 Big Number */}
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 'clamp(100px, 20vw, 200px)',
        fontWeight: 800,
        color: 'rgba(255,255,255,0.06)',
        lineHeight: 1,
        letterSpacing: '-8px',
        position: 'absolute',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        404
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: 480,
      }}>
        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'rgba(37,99,235,0.15)',
          border: '1px solid rgba(37,99,235,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <path d="M8 11h6" />
          </svg>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 50, padding: '6px 16px', marginBottom: 24,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', letterSpacing: 1 }}>
            PAGE NOT FOUND
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.2,
          marginBottom: 16,
          letterSpacing: '-0.5px',
        }}>
          Oops! Wrong Turn
        </h1>

        <p style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track to building your financial identity.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#2563EB', color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15, fontWeight: 600, padding: '14px 28px',
              border: 'none', borderRadius: 12, cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
            }}
            onMouseOver={e => {
              e.target.style.background = '#1d4ed8';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.target.style.background = '#2563EB';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Home
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15, fontWeight: 500, padding: '14px 28px',
              border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 12,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.borderColor = 'rgba(255,255,255,0.6)';
            }}
            onMouseOut={e => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
