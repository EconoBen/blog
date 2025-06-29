import React, { useState } from 'react';
import { workshopConfig, WorkshopItem } from '../config/workshopConfig';
import { gistItems } from '../config/workshopGists';

/**
 * Code & AI component with compact, navigable layout for code snippets and AI insights
 */
const CodeAI: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'compact' | 'full'>('compact');

  const { title, subtitle, categories } = workshopConfig;
  
  // Combine manual items with fetched gist items
  const allItems = [...workshopConfig.items, ...gistItems];

  // Filter items based on category and search
  const filteredItems = allItems.filter((item: WorkshopItem) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Group items by category for hierarchical display
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, WorkshopItem[]>);

  // Toggle item expansion
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Copy to clipboard with feedback
  const copyToClipboard = (content: string, itemId: string) => {
    navigator.clipboard.writeText(content);
    // Could add a toast notification here
  };

  return (
    <div className="code-ai-container">
      <div className="code-ai-header">
        <h1>{title}</h1>
        <p className="code-ai-subtitle">
          {subtitle}
        </p>
      </div>

      <div className="code-ai-controls">
        <div className="code-ai-search">
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="code-ai-search-input"
          />
        </div>

        <div className="code-ai-view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => setViewMode('compact')}
            title="Compact view"
          >
            ☰
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'full' ? 'active' : ''}`}
            onClick={() => setViewMode('full')}
            title="Full view"
          >
            ⊞
          </button>
        </div>
      </div>

      <div className="code-ai-layout">
        {/* Sidebar Navigation */}
        <aside className="code-ai-sidebar">
          <h3>Categories</h3>
          <nav className="code-ai-nav">
            {categories.map(category => {
              const count = category.id === 'all' 
                ? allItems.length 
                : allItems.filter(item => item.category === category.id).length;
              
              return (
                <button
                  key={category.id}
                  className={`code-ai-nav-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="nav-icon">{category.icon}</span>
                  <span className="nav-label">{category.label}</span>
                  <span className="nav-count">{count}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="code-ai-main">
          {viewMode === 'compact' ? (
            // Compact List View
            <div className="code-ai-list">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="code-ai-category-group">
                  <h3 className="category-group-title">
                    {categories.find(c => c.id === category)?.label || category}
                  </h3>
                  {categoryItems.map(item => (
                    <div key={item.id} className="code-ai-item-compact">
                      <div className="item-header" onClick={() => toggleExpanded(item.id)}>
                        <div className="item-title-row">
                          <span className="expand-icon">
                            {expandedItems.has(item.id) ? '▼' : '▶'}
                          </span>
                          <h4>{item.title}</h4>
                          <div className="item-badges">
                            <span className={`language-badge ${item.language}`}>
                              {item.language}
                            </span>
                          </div>
                        </div>
                        <p className="item-description">{item.description}</p>
                      </div>
                      
                      {expandedItems.has(item.id) && (
                        <div className="item-expanded">
                          <div className="item-content">
                            <pre>
                              <code className={`language-${item.language || 'text'}`}>
                                {item.content}
                              </code>
                            </pre>
                          </div>
                          <div className="item-footer">
                            <div className="item-tags">
                              {item.tags.map((tag: string) => (
                                <span key={tag} className="tag">#{tag}</span>
                              ))}
                            </div>
                            <div className="item-actions">
                              {item.gistUrl && (
                                <a 
                                  href={item.gistUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="gist-link"
                                  title="View on GitHub"
                                >
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                                  </svg>
                                </a>
                              )}
                              <button 
                                className="copy-btn"
                                onClick={() => copyToClipboard(item.content, item.id)}
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            // Full Card View (original grid layout)
            <div className="code-ai-grid">
              {filteredItems.map(item => (
                <div key={item.id} className="code-ai-card">
                  <div className="code-ai-card-header">
                    <h3>{item.title}</h3>
                    <div className="code-ai-card-badges">
                      <span className={`code-ai-language ${item.language || 'text'}`}>
                        {item.language || 'text'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="code-ai-card-description">{item.description}</p>
                  
                  <div className="code-ai-card-content">
                    <pre>
                      <code className={`language-${item.language || 'text'}`}>
                        {item.content}
                      </code>
                    </pre>
                  </div>

                  <div className="code-ai-card-footer">
                    <div className="code-ai-tags">
                      {item.tags.map((tag: string) => (
                        <span key={tag} className="code-ai-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="code-ai-card-actions">
                      {item.gistUrl && (
                        <a 
                          href={item.gistUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="code-ai-gist-link"
                          title="View on GitHub"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                          </svg>
                        </a>
                      )}
                      <button 
                        className="code-ai-copy-btn" 
                        onClick={() => copyToClipboard(item.content, item.id)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="code-ai-empty">
              <p>No snippets found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CodeAI;