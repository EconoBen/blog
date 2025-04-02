import React from 'react';

/**
 * Interface representing a reading list item
 */
interface ReadingItem {
  /** Title of the book or article */
  title: string;
  /** Author of the book or article */
  author: string;
  /** URL to the book or article */
  url: string;
  /** Short description */
  description: string;
  /** Types of reading material */
  type: 'book' | 'article' | 'paper' | 'documentation';
  /** Category/topic of the material */
  category: string;
}

/**
 * Reading List page component
 *
 * @returns {JSX.Element} The rendered ReadingList component
 */
const ReadingList: React.FC = () => {
  // Mock data - in a real app this would come from an API or database
  const readingItems: ReadingItem[] = [
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      url: "https://dataintensive.net/",
      description: "A deep dive into the principles of distributed systems and data engineering.",
      type: "book",
      category: "Distributed Systems"
    },
    {
      title: "Kubernetes Patterns",
      author: "Bilgin Ibryam & Roland Huß",
      url: "https://www.redhat.com/en/resources/oreilly-kubernetes-patterns-cloud-native-apps",
      description: "Reusable elements and patterns for designing cloud-native applications.",
      type: "book",
      category: "Containers"
    },
    {
      title: "The Phoenix Project",
      author: "Gene Kim, Kevin Behr & George Spafford",
      url: "https://itrevolution.com/the-phoenix-project/",
      description: "A novel about IT, DevOps, and helping your business win.",
      type: "book",
      category: "DevOps"
    },
    {
      title: "The Twelve-Factor App",
      author: "Adam Wiggins",
      url: "https://12factor.net/",
      description: "A methodology for building software-as-a-service apps.",
      type: "documentation",
      category: "Software Architecture"
    },
    {
      title: "Container Security Best Practices",
      author: "Snyk",
      url: "https://snyk.io/blog/10-docker-image-security-best-practices/",
      description: "Critical best practices for securing container images.",
      type: "article",
      category: "Security"
    },
    {
      title: "Cloud Design Patterns",
      author: "Microsoft",
      url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/",
      description: "Design patterns for building reliable, scalable, secure cloud applications.",
      type: "documentation",
      category: "Cloud Architecture"
    }
  ];

  /**
   * Gets unique categories from the reading list
   *
   * @returns {string[]} Array of unique categories
   */
  const getCategories = (): string[] => {
    const categories = readingItems.map(item => item.category);
    return Array.from(new Set(categories));
  };

  return (
    <div className="reading-list-page">
      <h1>Recommended Reading</h1>
      <p className="reading-list-intro">
        Here's a curated list of books, articles, and resources that I've found valuable in my
        professional journey. These have shaped my thinking and approach to technology.
      </p>

      {getCategories().map(category => (
        <div key={category} className="reading-list-category">
          <h2>{category}</h2>
          <div className="reading-list-items">
            {readingItems
              .filter(item => item.category === category)
              .map((item, index) => (
                <div key={index} className="reading-list-item">
                  <div className="reading-item-type">{item.type}</div>
                  <h3 className="reading-item-title">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h3>
                  <div className="reading-item-author">by {item.author}</div>
                  <p className="reading-item-description">{item.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadingList;
