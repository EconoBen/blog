import React from 'react';

/**
 * About page component
 *
 * @returns {JSX.Element} The rendered About component
 */
const About: React.FC = () => {
  return (
    <div className="about-page">
      <h1>About Me</h1>
      <div className="about-content">
        <div className="about-bio">
          <p>
            Hi, I'm a passionate technologist with expertise in containerization, cloud infrastructure, and DevOps practices.
            I created this blog to share my experiences and insights in the ever-evolving tech landscape.
          </p>
          <p>
            With over a decade of experience in software development and infrastructure management,
            I've worked on projects ranging from small startups to large enterprise systems.
            My focus is on creating scalable, maintainable, and efficient solutions that leverage modern technologies.
          </p>
        </div>

        <h2>Technical Expertise</h2>
        <ul className="skills-list">
          <li>Container orchestration with Kubernetes</li>
          <li>Docker and containerization strategies</li>
          <li>CI/CD pipeline optimization</li>
          <li>Cloud infrastructure (AWS, GCP, Azure)</li>
          <li>Infrastructure as Code (Terraform, CloudFormation)</li>
          <li>Microservice architecture</li>
          <li>Performance optimization</li>
          <li>Security best practices</li>
        </ul>

        <h2>Get in Touch</h2>
        <p>
          Feel free to reach out if you have questions, feedback, or just want to connect.
          I'm always interested in discussing tech, sharing knowledge, and exploring new opportunities.
        </p>
        <div className="contact-links">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:contact@example.com">Email</a>
        </div>
      </div>
    </div>
  );
};

export default About;
