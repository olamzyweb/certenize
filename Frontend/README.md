# Centenize - Blockchain Education & Soulbound Certificates

A modern, scalable React frontend for blockchain education, built with TypeScript, Vite, and Tailwind CSS. Features AI-powered quizzes, Soulbound Certificate minting, and Ethereum integration.

## 🚀 Features

### Core Functionality

- **AI-Powered Quizzes** - Interactive quizzes with automatic scoring.
- **Soulbound Certificates** - Mint unique blockchain credentials on Ethereum.
- **User Dashboard** - Track completed courses, certificates, and progress.
- **Responsive Design** - Mobile-first approach with a clean UI.
- **Custom Theme** - Dark mode with gradient and glow effects.

### Technical Features

- **TypeScript & React** - Type-safe components for maintainability.
- **Tailwind CSS** - Custom design system with shadcn/ui components.
- **State Management** - React Context for authentication and app state.
- **Protected Routes** - Role-based access for users.
- **Vite Development** - Fast refresh and optimized build system.

## 🏗️ Project Structure

public/
├── favicon.ico
├── favicon.svg
├── og-image.png
├── og-image-1.png
├── og-image.svg
├── placeholder.svg
└── robots.txt

src/
├── components/
│ ├── auth/
│ ├── certificates/
│ ├── home/
│ ├── layout/
│ ├── quiz/
│ ├── ui/
│ └── NavLink.tsx
├── hooks/
│ ├── use-mobile.tsx
│ ├── use-toast.ts
│ ├── useConfetti.ts
│ └── useQuizStore.ts
├── lib/
│ ├── api.ts
│ ├── utils.ts
│ └── web3-config.ts
├── pages/
│ ├── Gallery.tsx
│ ├── Home.tsx
│ ├── Mint.tsx
│ ├── NotFound.tsx
│ ├── Quiz.tsx
│ └── Result.tsx
├── types/
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts

.env
.gitignore
bun.lockb
components.json
eslint.config.js
index.html
package-lock.json
package.json
postcss.config.js
README.md
tailwind.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vercel.json
vite.config.ts

## 🔧 Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**

*git clone <YOUR_REPO_URL>
cd certenize*

2. **Install dependencies:**
   *npm install*
3. **Configure environment variables:**
   *cp .env.example .env*

**Example .env:**

```
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME="Centenize"
VITE_APP_DESCRIPTION="Blockchain Education & Soulbound Certificates"
VITE_APP_ENV=development
```

4. **Start development server:**
   *npm run dev*
6. **Build for production:**
   *npm run build*

🔗 **Backend Integration**

API endpoints for **quizzes**, **certificates**, and user management.

Pre-configured Axios instance with token handling and error management.

📱 Mobile Responsiveness

- Sidebar collapses on mobile.
- Tables scroll horizontally on small screens.
- Cards and components stack vertically on mobile.

🚀 Deployment

Deploy on Vercel, Netlify, or any static hosting.

Example production .env:

```
VITE_API_URL=https://api.centenize.app/api
VITE_APP_ENV=production
```

🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Follow existing code patterns.
4. Test thoroughly.
5. Submit a pull request.

📄 License

MIT License - see LICENSE file for details.

🆘 Support

- Open issues on GitHub.
- Verify API endpoints match .env configuration.
- Check role-based access and authentication flow.
