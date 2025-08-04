import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Economic Notes',
  description: 'Learn more about Ben Labaschin, a technology economist exploring the intersection of innovation and human behavior.',
};

export default function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <h1>Ben Labaschin</h1>
            <h2>Technology Economist & Writer</h2>
            <p className="about-tagline">
              Exploring the intersection of economics, technology, and human behavior through research, writing, and practical applications.
            </p>
          </div>
          <div className="about-hero-image">
            <img src="/assets/atlas_and_I.jpg" alt="Ben Labaschin" />
          </div>
        </div>
      </div>

      <div className="about-layout">
        <div className="about-content">
          <section className="about-section">
            <h2>About Me</h2>
            <div className="about-card">
              <p>
                I'm a technology economist passionate about understanding how innovation shapes our world. 
                My work focuses on the economic implications of emerging technologies, particularly in 
                artificial intelligence, shared mobility, and digital transformation.
              </p>
              <p>
                Through this blog, I share insights from my research, personal experiences, and observations 
                about the evolving relationship between technology and society.
              </p>
            </div>
          </section>

          <section className="about-section">
            <h2>Experience</h2>
            <div className="about-card">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="job-header">
                      <h3>Senior Economist</h3>
                      <div className="job-meta">
                        <span className="company">Technology Research Firm</span>
                        <span>2020 - Present</span>
                      </div>
                    </div>
                    <ul className="job-achievements">
                      <li>Leading research on AI economics and market dynamics</li>
                      <li>Publishing influential reports on technology adoption patterns</li>
                      <li>Advising Fortune 500 companies on digital transformation strategies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Skills & Expertise</h2>
            <div className="about-card">
              <div className="skills-grid">
                <div className="skill-category">
                  <h3>Economics & Analysis</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">Econometrics</span>
                    <span className="skill-tag">Market Analysis</span>
                    <span className="skill-tag">Behavioral Economics</span>
                    <span className="skill-tag">Game Theory</span>
                  </div>
                </div>
                <div className="skill-category">
                  <h3>Technology</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">Python</span>
                    <span className="skill-tag">Machine Learning</span>
                    <span className="skill-tag">Data Science</span>
                    <span className="skill-tag">Cloud Computing</span>
                  </div>
                </div>
                <div className="skill-category">
                  <h3>Communication</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">Technical Writing</span>
                    <span className="skill-tag">Public Speaking</span>
                    <span className="skill-tag">Data Visualization</span>
                    <span className="skill-tag">Research Publishing</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}