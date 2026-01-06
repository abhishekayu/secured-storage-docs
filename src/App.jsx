import React, { useState, useEffect, useRef } from "react";
import {
  Moon,
  Sun,
  Copy,
  Shield,
  Menu,
  X,
  Check,
  Package,
  Database,
  Cookie,
  Lock,
  Github,
  Heart,
  Scale,
  User,
  Activity,
  AlertCircle,
  Terminal,
  Cpu,
  Clock,
  Settings,
  FileKey,
} from "lucide-react";

// --- 1. Canvas Background Component (Green/Black Theme) ---
const ParticleNetworkCanvas = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 45;
    const connectionDistance = 160;
    const speed = 0.25;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Green tinted particles
      const particleColor = isDark
        ? "rgba(52, 211, 153, 0.15)"
        : "rgba(16, 185, 129, 0.15)"; // Emerald
      const lineColor = isDark
        ? "rgba(52, 211, 153, 0.05)"
        : "rgba(16, 185, 129, 0.05)";

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

// --- 2. Code Block Component ---
const CodeBlock = ({ title, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300 hover:border-emerald-500/30 dark:hover:border-emerald-500/30">
      {title && (
        <div className="flex justify-between items-center px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Terminal size={12} /> {title}
          </span>
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 dark:bg-emerald-800"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 dark:bg-emerald-800"></div>
          </div>
        </div>
      )}
      <div className="relative group">
        <pre className="p-5 overflow-x-auto text-sm font-mono text-neutral-800 dark:text-neutral-300 leading-relaxed scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-900">
          {code}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800"
          title="Copy code"
        >
          {copied ? (
            <Check
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

// --- 3. Section Component ---
const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="mb-24 scroll-mt-32">
    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="p-2.5 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
        <Icon size={26} strokeWidth={2} />
      </div>
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
        {title}
      </h2>
    </div>
    <div className="text-neutral-600 dark:text-neutral-400 leading-8 text-lg font-normal">
      {children}
    </div>
  </section>
);

// --- 4. Main Application ---
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "intro",
        "features",
        "aes",
        "install",
        "localstorage",
        "sessionstorage",
        "cookies",
        "indexeddb",
        "community",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 400) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "intro", label: "Introduction" },
    { id: "features", label: "Features" },
    { id: "aes", label: "AES Standard" },
    { id: "install", label: "Installation" },
    { id: "localstorage", label: "Local Storage" },
    { id: "sessionstorage", label: "Session Storage" },
    { id: "cookies", label: "Cookies" },
    { id: "indexeddb", label: "IndexedDB" },
    { id: "community", label: "Community" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 ${
        darkMode
          ? "dark bg-black text-neutral-100"
          : "bg-white text-neutral-900"
      }`}
    >
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-[-5] bg-white dark:bg-black transition-colors duration-300"></div>

      <ParticleNetworkCanvas isDark={darkMode} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-black/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="bg-black dark:bg-emerald-500 p-1.5 rounded-lg shadow-sm transition-colors">
                  <Lock size={18} strokeWidth={3} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  secured-storage-web
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/abhishekayu/webSecure-storage"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.npmjs.com/package/secured-storage-web"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                <Package size={14} />
                <span>NPM</span>
              </a>
              {/* <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-full bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 border border-neutral-200 dark:border-neutral-800 transition-all"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 pt-24 pb-10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          }`}
        >
          <div className="px-6 mb-8 lg:hidden">
            <div className="flex items-center gap-2 font-bold text-xl text-neutral-900 dark:text-neutral-100">
              <Menu /> Navigation
            </div>
          </div>
          <nav className="px-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-neutral-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-12 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <Section id="intro" title="Introduction" icon={Shield}>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl mb-6 font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                    secured-storage-web
                  </strong>{" "}
                  is a user-friendly package designed to facilitate secure data
                  storage across multiple mediums including{" "}
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    local storage, session storage, cookies, and indexedDB
                  </span>
                  .
                </p>
                <div className="p-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <p className="mb-0 text-lg">
                    Leveraging encryption techniques, it ensures data security
                    and mitigates common attacks. Additionally, it offers
                    features for <strong>integrity checks</strong> to ensure
                    data consistency and prevent corruption,{" "}
                    <strong>compressing data</strong>, and{" "}
                    <strong>hashing</strong>, thereby enhancing both security
                    and efficiency.
                  </p>
                </div>
              </div>
            </Section>

            {/* Features */}
            <Section id="features" title="Features" icon={Check}>
              <p className="mb-8 text-lg">
                secured-storage-web provides more secure operations to customize
                data storage and retrieval by offering passcode, HMAC key,
                algorithm, compression, and expiry time, and similar default
                operations for storage.
              </p>

              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {[
                  {
                    t: "Data Compression",
                    d: "Provide data compression parameters to compress data while storing it; you can manipulate them.",
                    i: <Cpu size={20} />,
                  },
                  {
                    t: "Expiry for Storage",
                    d: "You can set an expiration time for data by providing the time in milliseconds. Once expired, the data is removed.",
                    i: <Clock size={20} />,
                  },
                  {
                    t: "Separate Configuration",
                    d: "You can set passcodes and HMAC keys separately for each item. When retrieving, you need to provide them.",
                    i: <FileKey size={20} />,
                  },
                  {
                    t: "Global Configuration",
                    d: "Set a global passcode and HMAC key for the entire storage system. Each medium is treated separately.",
                    i: <Settings size={20} />,
                  },
                  {
                    t: "Data Integrity Checks",
                    d: "Implement checksums or other integrity checks to ensure data consistency and prevent corruption using hashing.",
                    i: <Activity size={20} />,
                  },
                  {
                    t: "Event System",
                    d: "Fire events for every storage type to detect changes, handle expired data, and get/set data.",
                    i: <AlertCircle size={20} />,
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group"
                  >
                    <div className="mb-3 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform origin-left">
                      {feat.i}
                    </div>
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-base mb-2">
                      {feat.t}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feat.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Lock
                    size={18}
                    className="text-emerald-600 dark:text-emerald-400"
                  />{" "}
                  Algorithm Supported
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "AES",
                    "DES",
                    "RC4",
                    "Rabbit",
                    "RabbitLegacy",
                    "TripleDES",
                    "EvpKDF",
                    "PBKDF2",
                    "RC4Drop",
                  ].map((algo) => (
                    <span
                      key={algo}
                      className="px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-white dark:bg-black text-emerald-700 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-800"
                    >
                      {algo}
                    </span>
                  ))}
                </div>
              </div>
            </Section>

            {/* AES Standard */}
            <Section
              id="aes"
              title="Advanced Encryption Standard (AES)"
              icon={Lock}
            >
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                <p className="text-lg leading-relaxed">
                  Our default encryption and decryption algorithm is{" "}
                  <strong>AES</strong>. The Advanced Encryption Standard is a
                  symmetric encryption algorithm that is the most frequently
                  used method of data encryption globally. Often referred to as
                  the gold standard for data encryption, AES is used by many
                  government bodies worldwide, including in the U.S.
                </p>
              </div>
            </Section>

            {/* Installation */}
            <Section id="install" title="Installation" icon={Package}>
              <CodeBlock
                title="Terminal"
                code="npm install secured-storage-web"
              />
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Usage 🚀
                </h3>
                <p className="mb-2">Import the package:</p>
                <CodeBlock
                  title="JavaScript"
                  code='import { ayu } from "secured-storage-web";'
                />
              </div>
            </Section>

            {/* Local Storage */}
            <Section id="localstorage" title="Local Storage" icon={Database}>
              <p className="mb-6">
                You can set a passcode and HMAC key for local storage, which
                will apply globally for localStorage. Once you've set these
                using the <code>setPasscode</code> and <code>setHmacKey</code>{" "}
                functions, you won't need to provide them again when setting or
                getting items.
              </p>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>{" "}
                    Global Configuration
                  </h3>
                  <p className="text-sm mb-3 text-neutral-500">
                    The HMAC key is optional; if you don't want to specify it,
                    the passcode will be used as the HMAC key by default.
                  </p>
                  <CodeBlock
                    title="Setup"
                    code={`ayu.localStorage.setPasscode("YourPasscode");\nayu.localStorage.setHmacKey("YourHMACKey");`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-emerald-700/70 dark:bg-emerald-400/70 rounded-full"></span>{" "}
                    Setting Data
                  </h3>
                  <p className="mb-4 text-base">
                    <strong>Mandatory Parameters:</strong> The <code>key</code>{" "}
                    and <code>data</code> parameters are mandatory.
                  </p>
                  <ul className="list-disc pl-5 mb-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>
                      <strong>Algorithm (algo):</strong> Specify encryption
                      algorithm (Default: AES).
                    </li>
                    <li>
                      <strong>Compression (compress):</strong> Default is true.
                      Pass false for uncompressed.
                    </li>
                    <li>
                      <strong>Expiry (expireAt):</strong> Set expiration time in
                      milliseconds.
                    </li>
                    <li>
                      <strong>Passcode:</strong> Mandatory if not set globally.
                    </li>
                  </ul>
                  <CodeBlock
                    title="setItem"
                    code={`ayu.localStorage.setItem({
  key: "Your Key", 
  data: "Your Data", 
  passcode: "Your Passcode", // Optional if set globally
  hmacKey: "Your HmacKey",   // Optional if set globally
  algo: "Your Algo",         // Optional (Default: AES)
  compress: true,            // Optional (Default: true)
  expireAt: 5000             // Optional (Default: null/never)
});`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-neutral-400 dark:bg-neutral-600 rounded-full"></span>{" "}
                    Getting Data
                  </h3>
                  <p className="mb-3 text-sm">
                    Passcode is mandatory for retrieval (ensure consistency with
                    storage). Algo and HmacKey are optional if defaults/globals
                    were used.
                  </p>
                  <CodeBlock
                    title="getItem"
                    code={`let data = ayu.localStorage.getItem({
  key: "Your Key", 
  passcode: "Your Passcode", // Mandatory if not set globally
  algo: "Your Algo",
  hmacKey: "Your Hmackey"
});
console.log(data);`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-neutral-300 dark:bg-neutral-700 rounded-full"></span>{" "}
                    Remove & Clear
                  </h3>
                  <p className="text-sm mb-3 opacity-90">
                    To be secure, we overwrite data with a random string 10
                    times before removal.
                  </p>
                  <CodeBlock
                    title="Cleanup"
                    code={`// Remove Item
ayu.localStorage.removeItem("Your Key");

// Clear LocalStorage
ayu.localStorage.clear();`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full"></span>{" "}
                    Events
                  </h3>
                  <CodeBlock
                    title="Event Listeners"
                    code={`// onLocalStoreSet
ayu.on("onLocalStoreSet", (key, data) => {
  console.log("Data set in LocalStore:", key, data);
});

// onLocalStoreGet
ayu.on("onLocalStoreGet", (key, data) => {
  console.log("Data get from LocalStore:", key, data);
});

// onLocalStoreRemoved
ayu.on("onLocalStoreRemoved", (key) => {
  console.log("Data removed or cleared from LocalStore:", key);
});

// onLocalStoreChange
ayu.on("onLocalStoreChange", (key, event) => {
  console.log("Local storage change detected:", key, event);
});

// onLocalStoreExpired
ayu.on("onLocalStoreExpired", (key) => {
  console.log(\`Data with key \${key} has been expired.\`);
});`}
                  />
                </div>
              </div>
            </Section>

            {/* Session Storage */}
            <Section
              id="sessionstorage"
              title="Session Storage"
              icon={Database}
            >
              <p className="mb-6">
                Similar to local storage, you can set a passcode and HMAC key
                for session storage, which will apply globally.
              </p>

              <CodeBlock
                title="Global Config"
                code={`ayu.sessionStorage.setPasscode("Your Passcode");
ayu.sessionStorage.setHmacKey("Your HmacKey");`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Setting & Getting
              </h3>
              <CodeBlock
                title="Operations"
                code={`// Set Item
ayu.sessionStorage.setItem({
  key: "Your Key",
  data: "Your Data",
  passcode: "Your Passcode",
  algo: "Your Algo",
  hmacKey: "Your HmacKey",
  compress: true,
  expireAt: 5000
});

// Get Item
let dataSession = ayu.sessionStorage.getItem({
  key: "Your Key",
  passcode: "Your Passcode",
  algo: "Your Algo",
  hmacKey: "Your Hmackey"
});
console.log(dataSession);`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Remove & Clear
              </h3>
              <CodeBlock
                title="Cleanup"
                code={`ayu.sessionStorage.removeItem("Your Key");
ayu.sessionStorage.clear();`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Events
              </h3>
              <CodeBlock
                title="Event Listeners"
                code={`ayu.on("onSessionStoreSet", (key, data) => {
  console.log(\`Data with key \${key} has been added to session storage.\`);
});

ayu.on("onSessionStoreGet", (key, data) => {
  console.log(\`Data with key \${key} has been gett to session storage.\`);
});

ayu.on("onSessionStoreRemoved", (key) => {
  console.log(\`Data with key \${key} has been removed from session storage.\`);
});

ayu.on("onSessionStoreChange", (key, event) => {
  console.log(\`Session storage change detected for key \${key}.\`);
});

ayu.on("onSessionStoreExpired", (key) => {
  console.log(\`Data with key \${key} has been expired.\`);
});`}
              />
            </Section>

            {/* Cookies */}
            <Section id="cookies" title="Cookies" icon={Cookie}>
              <p className="mb-6">
                Similar to local storage you can set passcode and hmac key for
                cookies which will apply globally.
              </p>
              <CodeBlock
                title="Configuration & Usage"
                code={`ayu.cookies.setPasscode("Your Passcode");
ayu.cookies.setHmacKey("Your HmacKey");

// Set Cookie
ayu.cookies.setItem({
  key: "Your Key",
  data: "Your Data",
  expireAt: 9000,
  passcode: "Your Passcode",
  algo: "Your Algo",
  hmacKey: "Your HmacKey",
  compress: false,
});

// Get Cookie
let datacookie = ayu.cookies.getItem({
  key: "Your Key",
  passcode: "Your Passcode",
  algo: "Your Algo",
  hmacKey: "Your HmacKey",
});
console.log(datacookie);

// Remove & Clear
ayu.cookies.removeItem("Your Key");
ayu.cookies.clear();`}
              />

              <h3 className="text-lg font-bold mt-8 mb-2 text-neutral-900 dark:text-neutral-100">
                Events
              </h3>
              <CodeBlock
                title="Event Listeners"
                code={`ayu.on("onCookieStoreSet", (key, data) => {
  console.log(\`Cookie with key \${(key, data)} has been added.\`);
});

ayu.on("onCookieStoreGet", (key, data) => {
  console.log(\`Cookie with key \${(key, data)} has been gett.\`);
});

ayu.on("onCookieStoreRemoved", (key) => {
  console.log(\`Cookie with key \${key} has been removed.\`);
});`}
              />
            </Section>

            {/* IndexedDB */}
            <Section id="indexeddb" title="IndexedDB" icon={Database}>
              <p className="mb-6">
                Offer a straightforward method to manage IndexedDB similar to
                localStorage. Allow storing data in IndexedDB as encrypted and
                compressed data for enhanced security and efficiency.
              </p>
              <CodeBlock
                title="Global Config"
                code={`ayu.indexedDB.setPasscode("Your Passcode");
ayu.indexedDB.setHmacKey("Your HmacKey");`}
              />

              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">
                Single Item Operations
              </h3>
              <CodeBlock
                title="Async Set & Get"
                code={`// Setting Single Item
ayu.indexedDB.setItem({
  dbName: "YourDatabaseName",
  storeName: "YourStoreName",
  key: "uniqueKey",
  data: { Your: "data" },
  compress: true,
  expireAt: 5000,
  passcode: "Your Passcode",
  algo: "Your Algo",
  hmacKey: "Your HmacKey",
})
.then(() => {
  console.log("Item set successfully.");
})
.catch((error) => {
  console.error("Error occurred while setting item:", error);
});

// Getting Single Item
ayu.indexedDB.getItem({
  dbName: "YourDatabaseName",
  storeName: "YourStoreName",
  key: "uniqueKey",
  passcode: "Your Passcode",
  algo: "Your Algo",
  hmacKey: "Your Hmackey",
})
.then((decryptedData) => {
  console.log("Decrypted data:", decryptedData);
})
.catch((error) => {
  console.error("Error occurred while getting item:", error);
});`}
              />

              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">
                Multiple Items (Bulk)
              </h3>
              <CodeBlock
                title="Bulk Set & Get"
                code={`// Set Multiple
const itemsToSet = [
  { key: "key1", data: { your: "data1" } },
  { key: "key2", data: { your: "data2" } }
];

const setItemPromises = itemsToSet.map((item) => {
  return ayu.indexedDB.setItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: item.key,
    data: item.data,
    compress: true,
    expireAt: 3600 * 1000,
    passcode: "Your Passcode",
    algo: "Your Algo",
    hmacKey: "Your Hmackey",
  });
});

Promise.all(setItemPromises)
  .then(() => console.log("All items set successfully."))
  .catch((error) => console.error("Error occurred while setting items:", error));


// Get Multiple
const keysToRetrieve = ["key1","key2"];
const getItemPromises = keysToRetrieve.map((key) => {
    return ayu.indexedDB.getItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: key,
    passcode: "Your Passcode",
    algo: "Your Algo",
    hmacKey: "Your Hmackey",
    });
});

Promise.all(getItemPromises)
  .then((decryptedDataArray) => {
    console.log("Decrypted data for all keys:", decryptedDataArray);
  })
  .catch((error) => {
    console.error("Error occurred while getting items:", error);
  });`}
              />

              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">
                Management
              </h3>
              <CodeBlock
                title="Remove, Clear, Delete"
                code={`// Remove Item
ayu.indexedDB.removeItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: "key2",
  })
  .then(() => console.log("Item removed successfully."))
  .catch((error) => console.error("Error occurred while removing item:", error));

// Clear Store
ayu.indexedDB.clear({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
  })
  .then(() => console.log("Store cleared successfully."))
  .catch((error) => console.error("Error occurred while clearing store:", error));

// Delete Database
ayu.indexedDB.deleteDB("YourDatabaseName")
  .then(() => console.log("Database deleted successfully."));`}
              />

              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-10 mb-4">
                Events
              </h3>
              <CodeBlock
                title="IndexedDB Events"
                code={`ayu.on("onIndexedDBSet", (key, data) => {
  console.log(\`Data with  \${key} has been added to indexedDB.\`);
});

ayu.on("onIndexedDBGet", (key, data) => {
  console.log(\`\${data} with \${key}has been added to indexedDB.\`);
});

ayu.on("onIndexedDBRemoved", (key, dbName, storeName) => {
  console.log(\`\${(dbName, storeName)} with key \${key} has been removed from indexedDB.\`);
});

ayu.on("onIndexedDBClear", (dbName, storeName) => {
  console.log(\`Store \${storeName} has been cleared from indexedDB.\`);
});

ayu.on("onIndexedDBDeleted", (dbName, storeName) => {
  console.log(\`Database \${(dbName, storeName)} has been deleted from indexedDB.\`);
});`}
              />
            </Section>

            {/* Community & License */}
            <Section id="community" title="Community & License" icon={Heart}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contributor Card */}
                <div className="relative group bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500/30">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6 flex items-center justify-center">
                    <User
                      size={40}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Abhishek Verma
                  </h3>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-6 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                    Contributor
                  </span>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 max-w-xs leading-relaxed italic">
                    "Important: For any Queries, Suggestions, or Improvements,
                    please don't hesitate to raise an issue."
                  </p>

                  <a
                    href="https://github.com/abhishekayu"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md shadow-emerald-500/20"
                  >
                    View Profile
                  </a>
                </div>

                {/* Contribute & License */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-neutral-900 dark:text-white font-bold text-lg">
                      <Activity size={24} className="text-emerald-500" />{" "}
                      Contribute
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                      Contributions are always welcome! Please read the{" "}
                      <strong>contribution guidelines</strong> first. If you
                      have any questions, feedback, or ideas for improvement,
                      please don't hesitate to raise an issue or submit a pull
                      request on GitHub.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-neutral-900 dark:text-white font-bold text-lg">
                      <Scale size={24} className="text-emerald-500" /> License
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      This project is licensed under the{" "}
                      <strong>MIT License</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <footer className="mt-24 pt-10 border-t border-neutral-200 dark:border-neutral-800 text-center pb-10">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Shield
                  className="text-emerald-600 dark:text-emerald-400"
                  size={20}
                />
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  secured-storage-web
                </span>
              </div>
              <p className="text-neutral-500 text-sm">
                &copy; {new Date().getFullYear()} Abhishek Verma. All rights
                reserved. Licensed under MIT.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
