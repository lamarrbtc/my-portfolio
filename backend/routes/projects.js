const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataFile = path.join(__dirname, '../data/projects.json');

// Helper function to read projects
const readProjects = () => {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  const data = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(data || '[]');
};

// Helper function to write projects
const writeProjects = (projects) => {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2));
};

// GET all projects
router.get('/', (req, res) => {
  try {
    const projects = readProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST create project (requires admin)
router.post('/', (req, res) => {
  try {
    // TODO: Add authentication middleware
    const { title, description, image, link, technologies } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const projects = readProjects();
    const newProject = {
      id: uuidv4(),
      title,
      description,
      image: image || '',
      link: link || '',
      technologies: technologies || [],
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project (requires admin)
router.put('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projects[index] = { ...projects[index], ...req.body, id: req.params.id };
    writeProjects(projects);
    res.json(projects[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project (requires admin)
router.delete('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const filteredProjects = projects.filter(p => p.id !== req.params.id);
    
    if (filteredProjects.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    writeProjects(filteredProjects);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
