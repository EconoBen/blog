import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Economic Notes',
  description: 'Learn more about Economic Notes and Benjamin Labaschin.',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1 className="page-title">About</h1>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Welcome to Economic Notes</h2>
          <p>
            Economic Notes is a blog exploring the intersection of economics, technology, 
            and artificial intelligence. Here, I share insights from my work in tech, 
            thoughts on economic trends, and explorations of how AI is reshaping our world.
          </p>
        </section>

        <section className="about-section">
          <h2>About Me</h2>
          <p>
            I'm Benjamin Labaschin, an economist and technologist passionate about understanding 
            how technology transforms economic systems and human behavior. My work spans 
            machine learning, data science, and economic analysis.
          </p>
          <p>
            Through this blog, I aim to bridge the gap between technical implementation 
            and economic theory, providing practical insights for developers, economists, 
            and anyone interested in the future of technology and society.
          </p>
        </section>

        <section className="about-section">
          <h2>Topics I Cover</h2>
          <ul className="topics-list">
            <li>Machine Learning & AI applications in economics</li>
            <li>Technology trends and their economic impact</li>
            <li>Practical coding tutorials and tools</li>
            <li>Data science for economic analysis</li>
            <li>Personal productivity and development workflows</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Connect</h2>
          <p>
            Feel free to reach out if you have questions, suggestions, or just want to 
            discuss any of the topics covered here. You can find me on:
          </p>
          <div className="social-links">
            <a href="https://github.com/EconoBen" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://twitter.com/econoben" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://linkedin.com/in/benjaminlabaschin" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </section>

        <section className="about-section">
          <h2>Technical Details</h2>
          <p>
            This blog is built with Next.js, React, and TypeScript. It features:
          </p>
          <ul className="features-list">
            <li>Server-side rendering for optimal performance</li>
            <li>OpenAI integration for text-to-speech capabilities</li>
            <li>GitHub Gists integration for code snippets</li>
            <li>Full-text search across all content</li>
            <li>Responsive design for all devices</li>
          </ul>
          <p>
            The source code is available on{' '}
            <a href="https://github.com/EconoBen/blog" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}