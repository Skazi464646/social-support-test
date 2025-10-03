# Start Project Guide

Follow these steps line by line to get the Social Support Portal running locally.

1. **Install prerequisites**
   - Node.js v18.0.0 or higher
   - npm v9.0.0 or higher (bundled with Node.js)
   - Git for cloning the repository

2. **Clone the repository**
   ```bash
   git clone https://github.com/Skazi464646/social-support-test.git
   cd social-support-test
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The Vite dev server prints a local URL (default http://localhost:5173). Open it in your browser to verify the UI.

5. **Run quality checks (optional but recommended)**
   ```bash
   npm run lint         # ESLint rules
   npm run type-check   # TypeScript diagnostics
   npm run format:check # Prettier formatting
   ```

6. **Build for production**
   ```bash
   npm run build
   ```
   The optimized output is generated in the `dist/` directory.

You are now ready to work on UI enhancements without breaking existing behavior.
