import React, { useState } from 'react';

/**
 * About component displaying professional information
 *
 * @returns {JSX.Element} The rendered About component
 */
const About: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  /**
   * Scroll to a specific section
   *
   * @param {string} sectionId - The ID of the section to scroll to
   */
  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>Ben Labaschin</h1>
          <h2>Principal Machine Learning Engineer</h2>
          <p className="about-tagline">
            Building intelligent systems that deliver measurable impact—from pioneering enterprise-scale
            GenAI platforms to developing ML systems that drive millions in business value.
          </p>
        </div>
      </div>

      <div className="about-layout">
        <div className="about-sidebar">
          <div className="about-nav">
            <button
              className={`about-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => scrollToSection('overview')}
            >
              Overview
            </button>
            <button
              className={`about-nav-item ${activeSection === 'experience' ? 'active' : ''}`}
              onClick={() => scrollToSection('experience')}
            >
              Experience
            </button>
            <button
              className={`about-nav-item ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => scrollToSection('skills')}
            >
              Skills
            </button>
            <button
              className={`about-nav-item ${activeSection === 'publications' ? 'active' : ''}`}
              onClick={() => scrollToSection('publications')}
            >
              Publications & Talks
            </button>
            <button
              className={`about-nav-item ${activeSection === 'education' ? 'active' : ''}`}
              onClick={() => scrollToSection('education')}
            >
              Education
            </button>
          </div>

          <div className="about-contact">
            <h3>Get In Touch</h3>
            <div className="about-social-links">
              <a href="https://github.com/econoben" target="_blank" rel="noopener noreferrer" className="about-social-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/benjamin-labaschin" target="_blank" rel="noopener noreferrer" className="about-social-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a href="mailto:benjaminlabaschin@gmail.com" className="about-social-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="about-content">
          <section id="overview" className="about-section">
            <h2>Overview</h2>
            <div className="about-card">
              <p>
                I'm a Principal Machine Learning Engineer passionate about transforming complex technical challenges into high-impact solutions. I thrive on building software systems that deliver tangible results, from pioneering enterprise-scale GenAI platforms to developing novel ML systems that drive millions in business value.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">🚀</div>
                  <div className="highlight-text">
                    <h4>AI Systems Architect</h4>
                    <p>Building scalable ML infrastructure from the ground up</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">💡</div>
                  <div className="highlight-text">
                    <h4>Innovation Driver</h4>
                    <p>2 patents and multiple business-critical ML innovations</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">📊</div>
                  <div className="highlight-text">
                    <h4>Value Creator</h4>
                    <p>Delivered $8M+ in savings and helped secure $96M investment</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">🔬</div>
                  <div className="highlight-text">
                    <h4>Published Author</h4>
                    <p>O'Reilly book on AI Agents and industry-recognized speaker</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="experience" className="about-section">
            <h2>Experience</h2>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="about-card">
                    <div className="job-header">
                      <h3>Principal Machine Learning Engineer</h3>
                      <div className="job-meta">
                        <div className="company">Workhelix</div>
                        <div className="duration">Apr. 2022 - Present</div>
                      </div>
                    </div>
                    <ul className="job-achievements">
                      <li>
                        <strong>Founding Engineer:</strong> Led core platform development as the sole engineer building enterprise causal inference architecture, async parallelized LLM APIs, SOTA embedding and clustering systems, and GraphQL/Docker-based pipelines.
                      </li>
                      <li>
                        <strong>ML/GenAI Analytics Platform:</strong> Architected multi-container Docker system for real-time data embedding and workflow analysis, combining proprietary "task" classification algorithms with predictive models (PyTorch, FastAPI, AWS ECR/ECS).
                      </li>
                      <li>
                        <strong>Analytics & Insights:</strong> Developed novel complexity metrics to quantify and forecast GenAI's impact on engineering workflows, enabling data-driven insights on productivity for enterprise customers.
                      </li>
                      <li>
                        <strong>API Architecture & Data Pipeline Engineering:</strong> Engineered high-throughput GitHub/GitLab extraction system with asyncio rate limiting and GraphQL cursor pagination, building robust task queues/concurrency controls that reduced repository processing time from 30 to 2 minutes.
                      </li>
                      <li>
                        <strong>Seed to Series A Growth:</strong> Drove critical technical development that enabled Workhelix's growth from seed to Series A ($75M valuation), attracting investment from AI leaders including Andrew Ng, Mira Murati, and Yann LeCun.
                      </li>
                    </ul>
                    <div className="job-tech">
                      <span className="tech-tag">PyTorch</span>
                      <span className="tech-tag">FastAPI</span>
                      <span className="tech-tag">AWS</span>
                      <span className="tech-tag">Docker</span>
                      <span className="tech-tag">GraphQL</span>
                      <span className="tech-tag">LLM</span>
                      <span className="tech-tag">Causal Inference</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="about-card">
                    <div className="job-header">
                      <h3>Senior Data Scientist</h3>
                      <div className="job-meta">
                        <div className="company">Hopper</div>
                        <div className="duration">Aug. 2021 - Apr. 2022</div>
                      </div>
                    </div>
                    <ul className="job-achievements">
                      <li>
                        <strong>Strategic Partnership Leadership:</strong> Led ML engineering for Capital One Travel partnership, creating foundational ML systems that helped secure a $96M investment and drove Hopper Cloud to 40% of company revenue.
                      </li>
                      <li>
                        <strong>Technical Architecture:</strong> Designed and implemented multi-tenant ML systems including multi-arm bandits and price freeze algorithms using GCP, enabling secure and scalable travel booking solutions for enterprise partners.
                      </li>
                      <li>
                        <strong>MLOps Innovation:</strong> Spearheaded DevOps/MLOps implementation for Hopper Cloud, establishing CI/CD pipelines and orchestration workflows with GitHub Actions and Kubeflow to support rapid scaling of the B2B platform.
                      </li>
                    </ul>
                    <div className="job-tech">
                      <span className="tech-tag">GCP</span>
                      <span className="tech-tag">MLOps</span>
                      <span className="tech-tag">GitHub Actions</span>
                      <span className="tech-tag">Kubeflow</span>
                      <span className="tech-tag">Multi-arm Bandits</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="about-card">
                    <div className="job-header">
                      <h3>Data Scientist</h3>
                      <div className="job-meta">
                        <div className="company">XPO Logistics</div>
                        <div className="duration">Jan. 2021 - Aug. 2021</div>
                      </div>
                    </div>
                    <ul className="job-achievements">
                      <li>
                        <strong>Cost Optimization & ML Systems:</strong> Delivered $8M in savings through optimized shipment prioritization and automated pricing systems, a result from spearheading A/B testing and ML initiatives using XGBoost.
                      </li>
                    </ul>
                    <div className="job-tech">
                      <span className="tech-tag">XGBoost</span>
                      <span className="tech-tag">A/B Testing</span>
                      <span className="tech-tag">Python</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="about-card">
                    <div className="job-header">
                      <h3>Data Scientist</h3>
                      <div className="job-meta">
                        <div className="company">Revantage (Blackstone)</div>
                        <div className="duration">Oct. 2019 - Jan. 2021</div>
                      </div>
                    </div>
                    <ul className="job-achievements">
                      <li>
                        <strong>Investment Analytics:</strong> Led A/B testing with power analysis and regression modeling to optimize real estate investment decisions, driving multi-million dollar property savings.
                      </li>
                      <li>
                        <strong>Analytics Engineering:</strong> Developed Python analytics pipeline (scipy, scikit-learn) for apartment renovation ROI analysis and geodata-based warehouse investment models.
                      </li>
                    </ul>
                    <div className="job-tech">
                      <span className="tech-tag">SciPy</span>
                      <span className="tech-tag">scikit-learn</span>
                      <span className="tech-tag">Regression</span>
                      <span className="tech-tag">GeoData</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="about-card">
                    <div className="job-header">
                      <h3>Economist Researcher / Data Scientist</h3>
                      <div className="job-meta">
                        <div className="company">Arity (Allstate)</div>
                        <div className="duration">Sept. 2017 - Oct. 2019</div>
                      </div>
                    </div>
                    <ul className="job-achievements">
                      <li>
                        <strong>Risk Innovation:</strong> Pioneered telematics-based risk modeling for shared mobility companies, resulting in two patent applications and creating a new business vertical.
                      </li>
                      <li>
                        <strong>Innovation Recognition:</strong> Won 2019 Hackathon for AWS-based NLP modeling, with research featured in Business Insider.
                      </li>
                    </ul>
                    <div className="job-tech">
                      <span className="tech-tag">Telematics</span>
                      <span className="tech-tag">Risk Models</span>
                      <span className="tech-tag">NLP</span>
                      <span className="tech-tag">AWS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="about-card">
                    <div className="job-header">
                      <h3>Adjunct Lecturer</h3>
                      <div className="job-meta">
                        <div className="company">Chapman University</div>
                        <div className="duration">Aug. 2023 - Dec. 2024</div>
                      </div>
                    </div>
                    <ul className="job-achievements">
                      <li>
                        Developed and taught Python-based AI/ML curriculum to 30+ students, bridging academic concepts with industry applications.
                      </li>
                    </ul>
                    <div className="job-tech">
                      <span className="tech-tag">Education</span>
                      <span className="tech-tag">Python</span>
                      <span className="tech-tag">AI/ML</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="skills" className="about-section">
            <h2>Skills</h2>
            <div className="about-card">
              <div className="skills-grid">
                <div className="skill-category">
                  <h3>Programming</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">Python</span>
                    <span className="skill-tag">Java</span>
                    <span className="skill-tag">C#</span>
                    <span className="skill-tag">R</span>
                    <span className="skill-tag">SQL</span>
                    <span className="skill-tag">Shell</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">CSS</span>
                    <span className="skill-tag">HTML</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h3>AI/ML</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">GenAI (LLama, Mistral, OpenAI)</span>
                    <span className="skill-tag">Fine-Tuning</span>
                    <span className="skill-tag">PyTorch</span>
                    <span className="skill-tag">Tensorflow</span>
                    <span className="skill-tag">Transformers</span>
                    <span className="skill-tag">NLP</span>
                    <span className="skill-tag">Ensembles</span>
                    <span className="skill-tag">Boosted Trees</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h3>Distributed Systems</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">PySpark</span>
                    <span className="skill-tag">Hadoop</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h3>Cloud</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">AWS</span>
                    <span className="skill-tag">GCP</span>
                    <span className="skill-tag">Azure</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h3>Deployment</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">GitHub Actions</span>
                    <span className="skill-tag">GitLab</span>
                    <span className="skill-tag">Docker</span>
                    <span className="skill-tag">FastAPI</span>
                    <span className="skill-tag">Flask</span>
                    <span className="skill-tag">Modal</span>
                  </div>
                </div>

                <div className="skill-category">
                  <h3>Databases</h3>
                  <div className="skill-tags">
                    <span className="skill-tag">PostgreSQL</span>
                    <span className="skill-tag">MySQL</span>
                    <span className="skill-tag">DuckDB</span>
                    <span className="skill-tag">Databricks</span>
                    <span className="skill-tag">Snowflake</span>
                    <span className="skill-tag">Athena</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="publications" className="about-section">
            <h2>Publications & Talks</h2>
            <div className="about-card">
              <div className="publication-list">
                <div className="publication-item">
                  <div className="publication-year">2024</div>
                  <div className="publication-details">
                    <h3>Building With AI: How I Build Quick POCs with LLMs</h3>
                    <p className="publication-venue">Wharton Guest Lecture</p>
                  </div>
                </div>

                <div className="publication-item">
                  <div className="publication-year">2024</div>
                  <div className="publication-details">
                    <h3>A Normie Approach to Validating LLM Outputs</h3>
                    <p className="publication-venue">AI.Science Talk</p>
                  </div>
                </div>

                <div className="publication-item featured-publication">
                  <div className="publication-year">2023</div>
                  <div className="publication-details">
                    <h3>What Are AI Agents?</h3>
                    <p className="publication-venue">O'Reilly Media (Book)</p>
                    <div className="publication-badges">
                      <span className="publication-badge">Featured</span>
                    </div>
                  </div>
                </div>

                <div className="publication-item">
                  <div className="publication-year">2023</div>
                  <div className="publication-details">
                    <h3>Building an HTTPS Model API for Cheap: AWS, Docker, and the Normconf API</h3>
                    <p className="publication-venue">Talk</p>
                  </div>
                </div>
              </div>

              <div className="patents-section">
                <h3>Patents</h3>
                <div className="patent-item">
                  <h4>Shared Mobility Simulation and Prediction System</h4>
                  <p className="patent-id">USPTO 20190347941</p>
                </div>
                <div className="patent-item">
                  <h4>Matching Drivers With Shared Vehicles To Optimize Shared Vehicle Services</h4>
                  <p className="patent-id">USPTO 20190347582</p>
                </div>
              </div>
            </div>
          </section>

          <section id="education" className="about-section">
            <h2>Education</h2>
            <div className="about-card">
              <div className="education-item">
                <div className="degree">B.A. Economics, cum laude</div>
                <div className="education-details">
                  <div className="university">Lake Forest College</div>
                  <div className="location">Lake Forest, Illinois</div>
                  <div className="year">2016</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
