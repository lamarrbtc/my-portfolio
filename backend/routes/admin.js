const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// TODO: Implement proper authentication/authorization

// GET all messages (admin only)
router.get('/messages', (req, res) => {
  try {
    // TODO: Verify admin access
    const messagesFile = path.join(__dirname, '../data/messages.json');
    if (!fs.existsSync(messagesFile)) {
      return res.json([]);
    }
    const data = fs.readFileSync(messagesFile, 'utf8');
    const messages = JSON.parse(data || '[]');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH mark message as read (admin only)
router.patch('/messages/:id', (req, res) => {
  try {
    const messagesFile = path.join(__dirname, '../data/messages.json');
    const data = fs.readFileSync(messagesFile, 'utf8');
    let messages = JSON.parse(data || '[]');
    
    const messageIndex = messages.findIndex(m => m.id === req.params.id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    messages[messageIndex].read = true;
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    res.json(messages[messageIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE message (admin only)
router.delete('/messages/:id', (req, res) => {
  try {
    const messagesFile = path.join(__dirname, '../data/messages.json');
    const data = fs.readFileSync(messagesFile, 'utf8');
    let messages = JSON.parse(data || '[]');
    
    const filteredMessages = messages.filter(m => m.id !== req.params.id);
    
    if (filteredMessages.length === messages.length) {
      return res.status(404).json({ error: 'Message not found' });
    }

    fs.writeFileSync(messagesFile, JSON.stringify(filteredMessages, null, 2));
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// GET portfolio stats (admin only)
router.get('/stats', (req, res) => {
  try {
    const projectsFile = path.join(__dirname, '../data/projects.json');
    const blogFile = path.join(__dirname, '../data/blog.json');
    const messagesFile = path.join(__dirname, '../data/messages.json');

    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8') || '[]');
    const blog = JSON.parse(fs.readFileSync(blogFile, 'utf8') || '[]');
    const messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8') || '[]');

    const unreadMessages = messages.filter(m => !m.read).length;

    res.json({
      projects: projects.length,
      blogPosts: blog.length,
      totalMessages: messages.length,
      unreadMessages
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
