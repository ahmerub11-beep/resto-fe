window.toastify = (msg, type = "info") => console.log(`[${type}]:`, msg);
window.getRandomID = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

window.isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
window.isValidName = (name) => /^[a-zA-Z0-9]+$/.test(name);

// main.jsx ya App.jsx ke top par:
window.api = import.meta.env.VITE_API_URL || "http://localhost:8000";

// window.api = import.meta.env.VITE_API_URL || "https://e-commerence-sev.vercel.app";
