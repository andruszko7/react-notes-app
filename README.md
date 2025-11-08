# React Notes App

A modern, elegant note-taking application built with React and Tailwind CSS.

## Features

- ✨ **Modern UI**: Clean, responsive design with Tailwind CSS
- 📝 **Rich Text Editing**: Simple and intuitive note editor
- 💾 **Local Storage**: Notes are automatically saved to your browser
- ⌨️ **Keyboard Shortcuts**: Press `Ctrl+S` to save notes quickly
- 🔍 **Quick Search**: Easy navigation through your notes
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- 🎨 **Beautiful Design**: Modern interface with smooth animations

## Tech Stack

- **React 19** - Latest React with modern hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Local Storage API** - Browser-based data persistence

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-notes-app.git
   cd react-notes-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

1. **Create a Note**: Click the "+ New Note" button
2. **Edit Notes**: Click on any note in the sidebar to edit
3. **Save Notes**: Changes are automatically saved, or press `Ctrl+S`
4. **Delete Notes**: Click the trash icon on any note
5. **Navigate**: Use the sidebar to switch between notes

## Project Structure

```
src/
├── components/
│   ├── NoteEditor.jsx    # Main note editing component
│   ├── NoteItem.jsx      # Individual note display
│   └── NoteList.jsx      # List of all notes
├── App.jsx               # Main application component
├── main.jsx              # React entry point
└── index.css             # Global styles with Tailwind
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)