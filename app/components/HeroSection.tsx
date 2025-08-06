'use client';

import React from 'react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-link">Economic Notes</span>
        </h1>
        <div className="hero-line"></div>
        <p className="hero-subtitle">
          Exploring economics, technology, and AI through research, writing, and practical insights. 
          From machine learning to economic theory, discover ideas that bridge academia and industry.
        </p>
        <div className="hero-cta">
          <Link href="/posts" className="hero-button primary">
            Explore Posts
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.44 8.5H2.75a.75.75 0 0 1 0-1.5h8.69L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </Link>
          <Link href="/about" className="hero-button secondary">
            About Me
          </Link>
        </div>
      </div>
      <div className="hero-decoration">
        <div className="hero-graphic">
          <div className="hero-badge-container">
            <div className="hero-badge economics">
              <span className="badge-text">Economics</span>
            </div>
            <div className="hero-badge ai">
              <span className="badge-text">AI & ML</span>
            </div>
            <div className="hero-badge tech">
              <span className="badge-text">Technology</span>
            </div>
            <div className="hero-badge research">
              <span className="badge-text">Research</span>
            </div>
          </div>
          <div className="hero-animation-elements">
            <div className="floating-element element-1"></div>
            <div className="floating-element element-2"></div>
            <div className="floating-element element-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
};