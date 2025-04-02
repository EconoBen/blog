document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const body = document.body;

    sidebarToggle.addEventListener('click', function() {
        body.classList.toggle('sidebar-open');
    });

    // Dark mode toggle functionality
    const darkModeToggle = document.querySelector('.dark-mode-toggle');

    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');

        // Save preference to localStorage
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        body.classList.add('dark-mode');
    }

    // Code block copy functionality
    const copyButtons = document.querySelectorAll('.code-action');

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const codeLines = codeBlock.querySelectorAll('.code-line');
            let code = '';

            codeLines.forEach(line => {
                code += line.textContent + '\n';
            });

            // Copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
                // Visual feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';

                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // Mobile sidebar handling - close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggleBtn = document.querySelector('.sidebar-toggle');

        // If sidebar is open and click is outside sidebar and not on the toggle button
        if (body.classList.contains('sidebar-open') &&
            !sidebar.contains(event.target) &&
            !sidebarToggleBtn.contains(event.target)) {
            body.classList.remove('sidebar-open');
        }
    });

    // Highlight active section in table of contents based on scroll position
    function updateActiveSection() {
        const headings = document.querySelectorAll('.blog-content h2, .blog-content h3');

        if (headings.length === 0) return;

        // Find the section currently in view
        let currentSection = headings[0].id;
        const scrollPosition = window.scrollY;

        headings.forEach(heading => {
            if (heading.offsetTop - 100 <= scrollPosition) {
                currentSection = heading.id;
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
    }

    // Initial call and scroll event listener
    if (document.querySelectorAll('.toc-item').length > 0) {
        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection);
    }
});
