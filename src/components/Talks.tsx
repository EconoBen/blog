import React from 'react';

/**
 * Interface representing a talk
 */
interface Talk {
  /** Title of the talk */
  title: string;
  /** Speaker who gave the talk */
  speaker: string;
  /** URL to the talk video */
  url: string;
  /** Year the talk was given */
  year: number;
  /** Conference or event where the talk was given */
  event: string;
  /** Description of the talk */
  description: string;
  /** Category or topic of the talk */
  category: string;
}

/**
 * Talks page component
 *
 * @returns {JSX.Element} The rendered Talks component
 */
const Talks: React.FC = () => {
  // Mock data - in a real app this would come from an API or database
  const talks: Talk[] = [
    {
      title: "The Future of Containers",
      speaker: "Kelsey Hightower",
      url: "https://www.youtube.com/watch?v=YLGVrqslpJ0",
      year: 2022,
      event: "KubeCon + CloudNativeCon",
      description: "Insights into where container technology is headed and how it will shape cloud computing.",
      category: "Containers"
    },
    {
      title: "Building Resilient Systems",
      speaker: "Charity Majors",
      url: "https://www.youtube.com/watch?v=xzJQ1hQm_OI",
      year: 2021,
      event: "SREcon",
      description: "How to build systems that can survive and thrive in the face of failures and uncertainty.",
      category: "Reliability"
    },
    {
      title: "GitOps: The Next Big Thing in DevOps",
      speaker: "Alexis Richardson",
      url: "https://www.youtube.com/watch?v=O_G1W4LgU0k",
      year: 2020,
      event: "DevOpsDays",
      description: "An exploration of GitOps principles and how they can transform your DevOps practices.",
      category: "DevOps"
    },
    {
      title: "The Cost of Cloud Native",
      speaker: "Liz Rice",
      url: "https://www.youtube.com/watch?v=6OMts5XZRpE",
      year: 2021,
      event: "CNCF Conference",
      description: "Understanding the true costs of running cloud native applications and how to optimize them.",
      category: "Cloud Native"
    },
    {
      title: "Designing for Scale",
      speaker: "Sam Newman",
      url: "https://www.youtube.com/watch?v=zq6PxBnj_hs",
      year: 2019,
      event: "QCon",
      description: "Architectural patterns for building systems that can scale effectively as demand grows.",
      category: "Architecture"
    },
    {
      title: "The Path to Production",
      speaker: "Cornelia Davis",
      url: "https://www.youtube.com/watch?v=S6VQ3ihA0JY",
      year: 2020,
      event: "Velocity Conference",
      description: "A comprehensive look at modern CI/CD pipelines and deployment strategies.",
      category: "CI/CD"
    }
  ];

  /**
   * Gets unique categories from the talks
   *
   * @returns {string[]} Array of unique categories
   */
  const getCategories = (): string[] => {
    const categories = talks.map(talk => talk.category);
    return Array.from(new Set(categories));
  };

  return (
    <div className="talks-page">
      <h1>Conference Talks</h1>
      <p className="talks-intro">
        These are some of the most influential conference talks that have shaped my understanding
        of software development, DevOps, cloud computing, and more. Each of these presentations
        offers valuable insights and practical knowledge.
      </p>

      {getCategories().map(category => (
        <div key={category} className="talks-category">
          <h2>{category}</h2>
          <div className="talks-list">
            {talks
              .filter(talk => talk.category === category)
              .map((talk, index) => (
                <div key={index} className="talk-item">
                  <h3 className="talk-title">
                    <a href={talk.url} target="_blank" rel="noopener noreferrer">
                      {talk.title}
                    </a>
                  </h3>
                  <div className="talk-meta">
                    <span className="talk-speaker">{talk.speaker}</span>
                    <span className="talk-event">{talk.event}</span>
                    <span className="talk-year">{talk.year}</span>
                  </div>
                  <p className="talk-description">{talk.description}</p>
                  <div className="talk-watch">
                    <a href={talk.url} target="_blank" rel="noopener noreferrer">
                      Watch Talk &rarr;
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Talks;
