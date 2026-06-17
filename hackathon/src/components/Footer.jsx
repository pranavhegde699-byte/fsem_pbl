import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Footer component for the WorkProof platform.
 * Provides consistent branding, navigation links, and legal info across all pages.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Home', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Schemes', to: '/schemes' },
    { label: 'Upload', to: '/upload' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Contact Us', to: '#' },
  ];

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0F172A 0%, #0B1120 100%)',
      padding: '64px 40px 32px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Top section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 48,
          paddingBottom: 40,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 6.5V13.5L10 18L17 13.5V6.5L10 2Z" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M10 7L10 13M7 9.5L13 9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: '#fff',
                letterSpacing: '-0.3px',
              }}>
                Work<span style={{ color: '#60A5FA' }}>Proof</span>
              </span>
            </div>
            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
            }}>
              Building verifiable financial identities for India's informal workforce.
              Your work has value — now prove it.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {footerLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={e => e.target.style.color = '#60A5FA'}
                  onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {legalLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={e => e.target.style.color = '#60A5FA'}
                  onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>Built With ❤️</h4>
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
            }}>
              Made for India's gig workers,<br />
              street vendors, and daily earners.
            </p>
            <div style={{
              marginTop: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 8,
              padding: '6px 12px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>
                Open Source Project
              </span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          paddingTop: 24,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            © {currentYear} WorkProof · All rights reserved
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            ⚠️ Not a government portal. Scores are indicative only.
          </p>
        </div>
      </div>
    </footer>
  );
}
