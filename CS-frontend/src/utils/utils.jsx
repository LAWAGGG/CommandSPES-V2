export const BASE_URL = "http://localhost:8000/api"

export const getLanguageLogo = (lang) => {
    const l = lang.toLowerCase().trim();
    const langMap = {
        "html": "html5",
        "css": "css3",
        "capacitor": "capacitor",
        "javascript": "javascript",
        "js": "javascript",
        "typescript": "typescript",
        "ts": "typescript",
        "react": "react",
        "reactjs": "react",
        "nextjs": "nextjs",
        "vue": "vuejs",
        "vuejs": "vuejs",
        "laravel": "laravel",
        "php": "php",
        "c#": "csharp",
        "cs": "csharp",
        "csharp": "csharp",
        "python": "python",
        "java": "java",
        "unity": "unity",
        "bootstrap": "bootstrap",
        "flutter": "flutter",
        "dart": "dart",
        "kotlin": "kotlin",
        "swift": "swift",
        "c++": "cplusplus",
        "cpp": "cplusplus",
        "c": "c",
        "go": "go",
        "golang": "go",
        "ruby": "ruby",
        "rust": "rust",
        "tailwind": "tailwindcss",
        "vite": "vitejs",
        "node": "nodejs",
        "nodejs": "nodejs",
        "express": "express",
        "expressjs": "express",
        "mysql": "mysql",
        "sql": "mysql",
        "sqlite": "sqlite",
        "postgresql": "postgresql",
        "mongodb": "mongodb",
        "firebase": "firebase"
    };

    const icon = langMap[l];
    if (icon) {
        return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`;
    }
    
    return null;
}
