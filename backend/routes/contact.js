const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataFile = path.join(__dirname, '../data/messages.json');

// Helper function to read messages
const readMessages = () => {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  const data = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper function to write messages
const writeMessages = (messages) => {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(messages, null, 2));
};

// POST submit contact form
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const messages = readMessages();
    const newMessage = {
      id: uuidv4(),
      name,
      email,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    writeMessages(messages);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message received! Thank you for contacting me.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
