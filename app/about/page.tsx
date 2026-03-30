import { Metadata } from 'next';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import { SidebarToggle } from '../components/SidebarToggle';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'About | Economic Notes',
  description: 'Learn more about Economic Notes and Benjamin Labaschin.',
};

export default async function AboutPage() {
  const posts = await postService.getAllPosts();
  const recentPosts = posts.slice(0, 10);

  return (
    <div className="blog-container">
      <Sidebar posts={recentPosts} />

      <div className="main-content">
        <NavBar />

        <div className="content-wrapper">
          <div className="about-container">
            <div className="about-hero">
              <div className="about-hero-content">
                <div className="about-hero-text">
                  <h1>About</h1>
                  <h2>Economics, AI, and technology</h2>
                  <p className="about-tagline">
                    Economic Notes explores the intersection of economics, software, and AI —
                    featuring deep-dives, tutorials, and analysis.
                  </p>
                </div>
                <div className="about-hero-image">
                  <img src="/icon-192.png" alt="Site icon" />
                </div>
              </div>
            </div>

            <div className="about-layout">
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
                  <div className="skills-grid">
                    <span className="skill-tag">AI & ML in Economics</span>
                    <span className="skill-tag">Tech trends</span>
                    <span className="skill-tag">Coding tutorials</span>
                    <span className="skill-tag">Data science</span>
                    <span className="skill-tag">Developer workflows</span>
                  </div>
                </section>

                <section className="about-section">
                  <h2>Connect</h2>
                  <div className="about-social-links">
                    <a className="about-social-link" href="https://github.com/EconoBen" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a className="about-social-link" href="https://twitter.com/econoben" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a className="about-social-link" href="https://linkedin.com/in/benjaminlabaschin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </div>
                </section>

                <section className="about-section">
                  <h2>Technical Details</h2>
                  <p>This blog is built with Next.js, React, and TypeScript and uses a unified CSS build.</p>
                  <p>
                    Source code: <a href="https://github.com/EconoBen/blog" target="_blank" rel="noopener noreferrer">GitHub</a>.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        <SidebarToggle />
      </div>
    </div>
  );
}