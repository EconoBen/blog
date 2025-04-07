import React, { useEffect } from 'react';
import CodeBlock from '../components/CodeBlock';
import { Link } from 'react-router-dom';

/**
 * BlogContent component containing the main blog post content
 *
 * @returns {JSX.Element} The rendered BlogContent component
 */
const BlogContent: React.FC = () => {

  /**
   * Updates the active section in the table of contents based on scroll position
   */
  const updateActiveSection = (): void => {
    const headings = document.querySelectorAll('.blog-content h2, .blog-content h3');

    if (headings.length === 0) return;

    // Find the section currently in view
    let currentSection = headings[0].id;
    const scrollPosition = window.scrollY;

    headings.forEach(heading => {
      // Type assertion to HTMLElement which has offsetTop property
      const headingElement = heading as HTMLElement;
      if (headingElement.offsetTop - 100 <= scrollPosition) {
        currentSection = headingElement.id;
      }
    });

    // Update active class in TOC
    const tocItems = document.querySelectorAll('.toc-item');
    tocItems.forEach(item => {
      item.classList.remove('active');
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  };

  useEffect(() => {
    // Initial call and scroll event listener for TOC highlighting
    if (document.querySelectorAll('.toc-item').length > 0) {
      updateActiveSection();
      window.addEventListener('scroll', updateActiveSection);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, []);

  return (
    <div className="main-content">
      <div className="main-nav">
        <div className="main-nav-item active"><Link to="/">Posts</Link></div>
        <div className="main-nav-item"><Link to="/talks">Talks</Link></div>
        <div className="main-nav-item"><Link to="/publications">Publications</Link></div>
        <div className="main-nav-item"><Link to="/archives">Archive</Link></div>
        <div className="main-nav-item"><Link to="/about">About</Link></div>
      </div>

      <div className="blog-header">
        <h1 className="blog-title">Optimizing Docker Build Pipelines for CI/CD</h1>
        <div className="blog-meta">
          April 2, 2025
          <span className="blog-tag">docker</span>
          <span className="blog-tag">cicd</span>
          <span className="blog-tag">performance</span>
        </div>
      </div>

      <div className="blog-content">
        <p id="introduction">
          After analyzing build times across several projects, I've identified key optimization
          strategies that significantly reduce Docker image build times without compromising quality. These approaches
          are particularly valuable in CI/CD pipelines where every second of build time impacts developer productivity
          and infrastructure costs.
        </p>

        <h2 id="layer-caching">Layer Caching Strategy</h2>

        <p>
          The most impactful improvement comes from proper <span className="term-reference">layer caching
            <div className="hover-card">
              <div className="hover-card-title">Docker Layer Caching</div>
              Docker builds images in layers, with each instruction creating a new layer.
              When you rebuild an image, Docker can reuse unchanged layers from cache,
              saving build time. Layers are identified by their content hash.
            </div>
          </span>. By organizing your <code>Dockerfile</code> to place rarely changed instructions at the top
          and frequently modified code at the bottom, you can maximize cache utilization.
        </p>

        <CodeBlock
          filename="Dockerfile"
          code={`# Place rarely changing instructions at the top
FROM node:16-alpine
WORKDIR /app

# Dependencies change less frequently than code
COPY package*.json ./
RUN npm ci

# Application code changes most frequently - keep at bottom
COPY . .
RUN npm run build`}
        />

        <p>
          This ordering ensures that changes to your application code don't invalidate the cached layers for dependency
          installation, which is typically the most time-consuming part of the build process.
        </p>

        <h2 id="multistage-builds">Multi-Stage Builds</h2>

        <p>
          <span className="term-reference">Multi-stage builds
            <div className="hover-card">
              <div className="hover-card-title">Multi-stage Builds</div>
              A technique that uses multiple FROM statements in a Dockerfile. Each FROM instruction begins a new stage of the build.
              You can selectively copy artifacts from one stage to another, leaving behind everything you don't need in the final image.
            </div>
          </span> provide another dimension of optimization, separating build dependencies from runtime
          requirements. This approach creates smaller, more secure production images by discarding unnecessary build
          tools and intermediate files.
        </p>

        <CodeBlock
          filename="Dockerfile.multistage"
          code={`# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
        />

        <p>
          In this example, the build tools, node_modules, and source code remain in the build stage, while only the
          compiled artifacts are copied to the production image, resulting in a dramatically smaller footprint.
        </p>

        <h2 id="buildkit">BuildKit Optimizations</h2>

        <p>
          Modern Docker installations include <span className="term-reference">BuildKit
            <div className="hover-card">
              <div className="hover-card-title">BuildKit</div>
              Docker's modern build system with advanced features like concurrent dependency resolution,
              enhanced caching, and automatic garbage collection of unused build cache.
              Enable with DOCKER_BUILDKIT=1 environment variable.
            </div>
          </span>, which offers several performance improvements over the legacy builder:
        </p>

        <ul>
          <li>Concurrent dependency resolution</li>
          <li>More efficient caching with content-addressable storage</li>
          <li>Automatic garbage collection of unused cache</li>
          <li>Build secrets without leaving them in the image layers</li>
        </ul>

        <p>
          Enable BuildKit by setting the <code>DOCKER_BUILDKIT=1</code> environment variable before your build
          commands:
        </p>

        <CodeBlock
          filename="build.sh"
          code={`export DOCKER_BUILDKIT=1
docker build -t myapp:latest .`}
        />

        <h2 id="ci-integration">CI Integration Tips</h2>

        <p>
          When integrating these optimizations into CI systems, consider these additional strategies:
        </p>

        <p>
          Implement dedicated cache storage solutions to maintain layer caches between builds. Most CI providers offer
          options for this:
        </p>

        <CodeBlock
          filename="github-actions-example.yml"
          code={`jobs:
 build:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v3

 - name: Set up Docker Buildx
 uses: docker/setup-buildx-action@v2

 - name: Build and push
 uses: docker/build-push-action@v3
 with:
 context: .
 push: false
 cache-from: type=gha
 cache-to: type=gha,mode=max`}
        />

        <h2 id="conclusion">Conclusion</h2>

        <p>
          By implementing these strategies—layer caching optimization, multi-stage builds, BuildKit adoption, and
          CI-specific caching—you can achieve significant reductions in Docker build times. In my projects, these
          techniques have consistently reduced build times by 40-60%, with some complex applications seeing even greater
          improvements.
        </p>

        <p>
          These optimizations not only speed up your CI/CD pipeline but also reduce resource consumption and
          infrastructure costs while improving developer productivity. Remember that the specific impact will vary based
          on your application's complexity, but the principles apply universally to Docker-based workflows.
        </p>
      </div>
    </div>
  );
};

export default BlogContent;
