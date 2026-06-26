const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataFile = path.join(__dirname, '../data/blog.json');

// Helper function to read blog posts
const readBlog = () => {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  const data = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper function to write blog posts
const writeBlog = (posts) => {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2));
};

// GET all blog posts
router.get('/', (req, res) => {
  try {
    const posts = readBlog().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET single blog post
router.get('/:id', (req, res) => {
  try {
    const posts = readBlog();
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// POST create blog post (requires admin)
router.post('/', (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const posts = readBlog();
    const newPost = {
      id: uuidv4(),
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(newPost);
    writeBlog(posts);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// PUT update blog post (requires admin)
router.put('/:id', (req, res) => {
  try {
    const posts = readBlog();
    const index = posts.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    posts[index] = {
      ...posts[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    writeBlog(posts);
    res.json(posts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// DELETE blog post (requires admin)
router.delete('/:id', (req, res) => {
  try {
    const posts = readBlog();
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    
    if (filteredPosts.length === posts.length) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    writeBlog(filteredPosts);
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

module.exports = router;
