# My Portfolio

A full-featured portfolio website with HTML/CSS frontend and Node.js/Express backend with file-based storage.

## Features

✨ **Project Showcase** - Display your best work with descriptions and images
📝 **Blog** - Write and publish case studies and articles
💬 **Contact Form** - Get messages from visitors
🎨 **Admin Dashboard** - Manage projects, blog posts, and messages
🌙 **Dark Mode** - Toggle between light and dark themes
📱 **Responsive Design** - Works perfectly on all devices

## Project Structure

```
my-portfolio/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── projects.js
│   │   ├── blog.js
│   │   ├── contact.js
│   │   └── admin.js
│   ├── data/
│   │   ├── projects.json
│   │   ├── blog.json
│   │   └── messages.json
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/lamarrbtc/my-portfolio.git
cd my-portfolio
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Start the backend server
```bash
npm start
```

4. Open the frontend
```bash
Open frontend/index.html in your browser or navigate to http://localhost:3000
```

## API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project (admin)
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create a new blog post (admin)
- `POST /api/contact` - Submit a contact message
- `GET /api/messages` - Get all messages (admin)

## License

MIT License
