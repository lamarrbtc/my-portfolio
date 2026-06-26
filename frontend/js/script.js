// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = '/api';

// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.add(savedTheme);
  updateThemeToggle();
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const theme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
  localStorage.setItem('theme', theme);
  updateThemeToggle();
});

function updateThemeToggle() {
  themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// ============================================
// NAVIGATION
// ============================================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksArray = document.querySelectorAll('.nav-link');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navLinksArray.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    updateActiveNav(link);
  });
});

function updateActiveNav(clickedLink) {
  navLinksArray.forEach(link => link.classList.remove('active'));
  clickedLink.classList.add('active');
}

// Update active nav on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinksArray.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// ============================================
// PROJECTS
// ============================================

async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    document.getElementById('projects-grid').innerHTML =
      '<p>Error loading projects. Please try again later.</p>';
  }
}

function renderProjects(projects) {
  const projectsGrid = document.getElementById('projects-grid');
  projectsGrid.innerHTML = '';

  if (projects.length === 0) {
    projectsGrid.innerHTML = '<p>No projects found.</p>';
    return;
  }

  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-image">
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project</a>` : ''}
      </div>
    `;
    projectsGrid.appendChild(projectCard);
  });
}

// ============================================
// BLOG
// ============================================

async function fetchBlog() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`);
    const posts = await response.json();
    renderBlog(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    document.getElementById('blog-grid').innerHTML =
      '<p>Error loading blog posts. Please try again later.</p>';
  }
}

function renderBlog(posts) {
  const blogGrid = document.getElementById('blog-grid');
  blogGrid.innerHTML = '';

  if (posts.length === 0) {
    blogGrid.innerHTML = '<p>No blog posts found.</p>';
    return;
  }

  posts.forEach(post => {
    const date = new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.innerHTML = `
      <div class="blog-header">
        <div class="blog-date">${date}</div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
      </div>
      <div class="blog-footer">
        <div class="blog-tags">
          ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
        <a href="#" class="blog-read-more">Read</a>
      </div>
    `;
    blogGrid.appendChild(blogCard);
  });
}

// ============================================
// CONTACT FORM
// ============================================

const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (response.ok) {
      formMessage.textContent = result.message;
      formMessage.className = 'form-message success show';
      contactForm.reset();
      setTimeout(() => {
        formMessage.classList.remove('show');
      }, 5000);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    formMessage.textContent = 'Failed to send message. Please try again.';
    formMessage.className = 'form-message error show';
  }
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  fetchProjects();
  fetchBlog();
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-card, .blog-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
