import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, Grid } from "@react-three/drei";
import { Mail, Menu, X, ExternalLink, Download, GraduationCap, Code2, Shield, Cpu } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import * as THREE from "three";

/* ───── Swipe Animation Hook ───── */
const subtitles = [
  "Cybersecurity Enthusiast",
  "Quantum Computing Explorer",
  "Security Researcher",
];

function useSwipeAnimation(strings, interval = 3000) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % strings.length);
    }, interval);
    return () => clearInterval(timer);
  }, [strings.length, interval]);
  return index;
}

/* ───── 3D Components ───── */
// Color constants for the new indigo/violet/pink scheme
const COL = { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899', bg: '#0f172a' };

// Global mouse position ref (normalized -1 to 1)
const globalMouse = { x: 0, y: 0 };
function FloatingParticles() {
  const ref = useRef();
  const count = 9000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.4;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#c084fc" size={0.035} sizeAttenuation depthWrite={false} opacity={0.8} />
    </Points>
  );
}

/* Orbital ring of particles */
function OrbitalRing({ color = "#ec4899", radius = 2.8, tiltX = 0.6, speed = 0.3, particleCount = 1500 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const r = radius + (Math.random() - 0.5) * 0.5;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, [particleCount, radius]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
      ref.current.rotation.x = tiltX;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={0.025} sizeAttenuation depthWrite={false} opacity={0.9} />
    </Points>
  );
}

/* DNA Helix particle streams */
function HelixStreams() {
  const ref = useRef();
  const count = 1800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8;
      const strand = i % 2 === 0 ? 1 : -1;
      const r = 1.8 + Math.sin(t * 0.5) * 0.3;
      arr[i * 3] = Math.cos(t) * r * strand * 0.6;
      arr[i * 3 + 1] = (i / count) * 6 - 3 + (Math.random() - 0.5) * 0.1;
      arr[i * 3 + 2] = Math.sin(t) * r * 0.6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#e879f9" size={0.02} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  );
}

/* Energy arcs — radiating particle bursts */
function EnergyArcs() {
  const ref = useRef();
  const count = 800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.4 + (i % 5) * 0.6 + Math.random() * 0.2;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle * 3) * 0.4 + (Math.random() - 0.5) * 0.3;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = -state.clock.elapsedTime * 0.2;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#a78bfa" size={0.018} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function RotatingSphere() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = state.clock.elapsedTime * 0.08;
    }
  });
  return (
    <Sphere ref={ref} args={[1.3, 80, 80]}>
      <meshStandardMaterial wireframe color="#a78bfa" emissive="#7c3aed" emissiveIntensity={1.5} transparent opacity={0.45} />
    </Sphere>
  );
}

/* Outer decorative wireframe ring */
function OuterRing() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = -state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });
  return (
    <Sphere ref={ref} args={[2.4, 36, 36]}>
      <meshStandardMaterial wireframe color="#c084fc" emissive="#9333ea" emissiveIntensity={0.8} transparent opacity={0.15} />
    </Sphere>
  );
}

/* Inner glow core — pulsing energy center */
function GlowCore() {
  const ref = useRef();
  const matRef = useRef();
  useFrame((state) => {
    if (ref.current) {
      const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      ref.current.scale.set(pulse, pulse, pulse);
    }
    if (matRef.current) {
      const t = state.clock.elapsedTime;
      const r = 0.55 + Math.sin(t * 0.8) * 0.15;
      const g = 0.2 + Math.sin(t * 1.2) * 0.1;
      const b = 0.85 + Math.sin(t * 0.6) * 0.1;
      matRef.current.color.setRGB(r, g, b);
      matRef.current.opacity = 0.2 + Math.sin(t * 2) * 0.08;
    }
  });
  return (
    <Sphere ref={ref} args={[0.9, 32, 32]}>
      <meshBasicMaterial ref={matRef} color="#8b5cf6" transparent opacity={0.2} />
    </Sphere>
  );
}

/* Cyber grid floor */
function CyberGrid() {
  return (
    <Grid
      position={[0, -3, 0]}
      args={[30, 30]}
      cellSize={0.8}
      cellThickness={0.6}
      cellColor="#1e1b4b"
      sectionSize={3}
      sectionThickness={1}
      sectionColor="#6366f1"
      fadeDistance={18}
      fadeStrength={1.5}
      infiniteGrid
    />
  );
}

function Scene() {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, globalMouse.y * 0.5, 0.03);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, globalMouse.x * 0.5, 0.03);
    }
  });
  return (
    <>
      {/* Fog pushed back for more depth visibility */}
      <fog attach="fog" args={['#0f172a', 8, 28]} />

      {/* Enhanced multi-source lighting — purple/violet palette */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={70} color="#7c3aed" distance={20} decay={2} />
      <pointLight position={[-5, -3, 3]} intensity={50} color="#8b5cf6" distance={18} decay={2} />
      <pointLight position={[0, 3, -5]} intensity={40} color="#ec4899" distance={15} decay={2} />
      <pointLight position={[3, -2, 4]} intensity={35} color="#a78bfa" distance={14} decay={2} />
      <pointLight position={[-3, 4, -3]} intensity={30} color="#c084fc" distance={12} decay={2} />
      <directionalLight position={[0, 8, 4]} intensity={0.5} color="#ede9fe" />

      <group ref={groupRef}>
        <RotatingSphere />
        <OuterRing />
        <GlowCore />
        <FloatingParticles />
        {/* Dual orbital rings at different angles */}
        <OrbitalRing color="#ec4899" radius={2.8} tiltX={0.6} speed={0.3} />
        <OrbitalRing color="#c084fc" radius={3.2} tiltX={-0.8} speed={-0.2} particleCount={1000} />
        {/* DNA helix streams */}
        <HelixStreams />
        {/* Energy arcs */}
        <EnergyArcs />
      </group>

      {/* Grid stays fixed (not affected by mouse parallax) */}
      <CyberGrid />
    </>
  );
}

/* ───── Section Header ───── */
function SectionHeader({ children, gradient = "from-purple-400 to-pink-500" }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}
    >
      {children}
    </motion.h2>
  );
}

/* ───── Data ───── */
const GITHUB = "https://github.com/ananTripathi-future";
const EMAIL = "omanant.tripathi@gmail.com";

const navItems = ["Home", "About", "Education", "Skills", "Projects", "Contact"];

const skills = [
  { name: "Python", icon: <Code2 size={22} /> },
  { name: "C++", icon: <Code2 size={22} /> },
  { name: "Java", icon: <Code2 size={22} /> },
  { name: "Cybersecurity", icon: <Shield size={22} /> },
  { name: "Linux", icon: <Cpu size={22} /> },
  { name: "Quantum Computing", icon: <Cpu size={22} /> },
  { name: "Networking", icon: <Shield size={22} /> },
];

const projects = [
  {
    title: "Advanced Audio Steganography",
    problem: "Traditional covert communication channels are easily detectable by modern steganalysis tools, and lack encryption integrity.",
    contribution: "Built an end-to-end AES-encrypted steganographic pipeline that hides data inside WAV audio files with identity-based handshakes and automated email key delivery.",
    tech: ["Python", "AES Encryption", "WAV Processing", "Steganography"],
    github: GITHUB,
  },
  {
    title: "Quantum Secure Drone System",
    problem: "Current drone communication protocols rely on classical cryptography vulnerable to quantum computing attacks.",
    contribution: "Designed a post-quantum cryptographic (PQC) communication layer with combinatorial obfuscation and rotating identifiers for real-time drone telemetry.",
    tech: ["C++", "PQC", "Networking", "Embedded Systems"],
    github: GITHUB,
  },
  {
    title: "PQC Trinity Gateway",
    problem: "Enterprise network gateways lack quantum-resilient authentication, leaving infrastructure exposed to harvest-now-decrypt-later attacks.",
    contribution: "Architected a three-layer post-quantum gateway combining lattice-based key exchange, hash-based signatures, and code-based encryption for defence-in-depth.",
    tech: ["Cryptography", "Network Security", "PQC", "Python"],
    github: GITHUB,
  },
  {
    title: "QuantumMed AI",
    problem: "Healthcare diagnostics suffer from slow model inference and data privacy concerns when using classical cloud ML pipelines.",
    contribution: "Conceptualized and prototyped a quantum-enhanced AI diagnostic system that leverages variational quantum circuits for faster inference while preserving patient data privacy.",
    tech: ["AI/ML", "Quantum Computing", "Healthcare", "Python"],
    github: GITHUB,
  },
];

/* ───── Main Portfolio ───── */
export default function Portfolio() {
  const [active, setActive] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const swipeIndex = useSwipeAnimation(subtitles, 3000);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let current = "Home";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - s.offsetHeight / 3) current = s.getAttribute("id");
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global mouse tracking for 3D scene
  useEffect(() => {
    const handleMouseMove = (e) => {
      globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-transparent text-white min-h-screen font-sans selection:bg-indigo-500/30">
      {/* Fixed full-page 3D background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }} style={{ pointerEvents: 'none' }}>
          <Scene />
        </Canvas>
      </div>

      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 origin-left z-[60]" style={{ scaleX }} />

      {/* ── NAVBAR ── */}
      <nav className="fixed w-full flex justify-between items-center px-6 py-4 bg-[#0f172a]/70 backdrop-blur-md z-50 border-b border-white/5">
        <a href="#Home" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">
          Anant Tripathi
        </a>
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a key={item} href={`#${item}`} className={`relative text-sm font-medium transition-colors hover:text-indigo-400 ${active === item ? "text-indigo-400" : "text-gray-400"}`}>
              {item}
              {active === item && (
                <motion.div layoutId="activeNav" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-indigo-400" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
            </a>
          ))}
        </div>
        <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center gap-8 md:hidden transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {navItems.map((item) => (
          <a key={item} href={`#${item}`} onClick={() => setIsMenuOpen(false)} className={`text-2xl font-semibold tracking-wider ${active === item ? "text-indigo-400" : "text-gray-400"}`}>
            {item}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="Home" className="min-h-screen relative flex flex-col justify-center items-center text-center overflow-hidden pt-20">

        {/* Hero content in glassmorphism panel */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative z-10 px-6 max-w-4xl">
          <div className="rounded-2xl sm:rounded-3xl px-4 py-8 sm:px-8 sm:py-12 md:px-14 md:py-16" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="mb-6">
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <motion.span
                  initial={{ x: -120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400"
                  style={{ textShadow: '0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.25)' }}
                >Anant</motion.span>{" "}
                <motion.span
                  initial={{ x: -120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-300"
                  style={{ textShadow: '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.25)' }}
                >Tripathi</motion.span>
              </h1>

              {/* Swipe Animation */}
              <div className="h-8 sm:h-10 flex items-center justify-center overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={swipeIndex}
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -80, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="text-base sm:text-xl md:text-2xl font-semibold tracking-wide absolute"
                    style={{ color: '#c084fc', textShadow: '0 0 20px rgba(192,132,252,0.4)' }}
                  >
                    {subtitles[swipeIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <p className="text-gray-300 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
                Building quantum-resilient security systems and breaking into the future of ethical hacking — one vulnerability at a time.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
              <a href="#Projects" className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-full font-bold text-sm sm:text-base shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.7)] transition-all duration-300 hover:-translate-y-1 text-center">
                View Projects
              </a>
              <a href="/resume.html" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white/5 border border-white/20 hover:border-pink-400 text-white rounded-full font-bold text-sm sm:text-base hover:bg-pink-500/10 hover:shadow-[0_0_20px_-5px_rgba(236,72,153,0.4)] transition-all duration-300 hover:-translate-y-1">
                <ExternalLink size={18} /> Resume
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="flex gap-4 sm:gap-5 justify-center mt-8 sm:mt-10">
              {[
                { href: GITHUB, icon: <FaGithub size={22} />, hover: "hover:border-indigo-400 hover:text-indigo-400 hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]" },
                { href: "https://linkedin.com", icon: <FaLinkedin size={22} />, hover: "hover:border-violet-400 hover:text-violet-400 hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)]" },
                { href: `mailto:${EMAIL}`, icon: <Mail size={22} />, hover: "hover:border-pink-400 hover:text-pink-400 hover:shadow-[0_0_15px_-3px_rgba(236,72,153,0.4)]" },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={`group p-3 sm:p-3.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 ${s.hover}`}>
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 text-gray-500 hidden sm:block">
          <div className="w-[30px] h-[50px] rounded-full border-2 border-gray-500 flex justify-center p-2">
            <div className="w-1 h-3 bg-gray-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <section id="About" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative z-10 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <SectionHeader gradient="from-indigo-400 to-pink-500">About Me</SectionHeader>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col gap-6 text-sm sm:text-lg md:text-xl text-gray-300 leading-relaxed text-center">
              <p>
                I’m <span className="text-indigo-400 font-bold">Anant Tripathi</span>, a Computer Science Engineering student passionate about <span className="text-indigo-400 font-semibold">Cybersecurity</span>, <span className="text-violet-400 font-semibold">Ethical Hacking</span>, and <span className="text-pink-400 font-semibold">Quantum Computing</span>. I enjoy building secure systems, exploring advanced technologies, and solving real-world security challenges through innovation and research.
              </p>
              <p>
                I have participated in multiple hackathons and won <span className="text-amber-400 font-semibold">1st place in IoRT and Cybersecurity competitions</span>. My interests include Purple Teaming, secure communication systems, AI-powered security solutions, and quantum-resilient technologies.
              </p>
              <p>
                Currently, I’m focused on strengthening my skills in <span className="text-indigo-400 font-medium">Python</span>, <span className="text-violet-400 font-medium">C++</span>, <span className="text-pink-400 font-medium">Linux</span>, <span className="text-indigo-400 font-medium">Networking</span>, and <span className="text-violet-400 font-medium">Offensive Security</span> while building impactful projects that combine cybersecurity and emerging technologies.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="Education" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative z-10 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <SectionHeader gradient="from-indigo-400 to-violet-500">Education</SectionHeader>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 items-center justify-center shrink-0">
                <GraduationCap size={32} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">SRM University</h3>
                <p className="text-lg text-indigo-400 font-medium mt-1">B.Tech — Computer Science & Engineering</p>
                <p className="text-gray-400 mt-2">2024 — 2028</p>
                <p className="text-gray-400 mt-4 leading-relaxed text-sm">
                  Focusing on cybersecurity, quantum computing, and secure systems engineering with hands-on research projects in post-quantum cryptography and AI-driven security.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="Skills" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative z-10 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <SectionHeader gradient="from-violet-400 to-pink-400">Technical Arsenal</SectionHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
            {skills.map((skill, i) => (
              <motion.div key={skill.name} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group p-4 sm:p-6 bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-xl sm:rounded-2xl text-center hover:bg-[#263248]/60 hover:border-violet-500/40 transition-all duration-300">
                <div className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <h3 className="text-sm sm:text-base text-gray-200 font-medium group-hover:text-white transition-colors">{skill.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="Projects" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative z-10 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <SectionHeader gradient="from-indigo-400 to-pink-500">Featured Projects</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            {projects.map((project, i) => (
              <motion.div key={project.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                <div className="p-5 sm:p-7 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                  <div className="space-y-3 mb-6 flex-grow">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Problem</h4>
                      <p className="text-gray-300 leading-relaxed text-sm">{project.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">My Contribution</h4>
                      <p className="text-gray-300 leading-relaxed text-sm">{project.contribution}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">{t}</span>
                    ))}
                  </div>
                  <a href={project.github} target="_blank" rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500 text-white rounded-xl transition-all duration-300 font-medium group/btn">
                    <FaGithub size={18} /> <span>View Repository</span> <ExternalLink size={14} className="text-gray-500 group-hover/btn:text-indigo-400 transition-colors" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="Contact" className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 relative z-10 bg-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader gradient="from-indigo-400 to-pink-400">Let's Connect</SectionHeader>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-sm sm:text-lg text-gray-400 mb-8 sm:mb-12">Interested in collaborating on cybersecurity research or quantum computing projects? Reach out!</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto">
              {[
                { label: "Email", href: `mailto:${EMAIL}`, icon: <Mail size={28} />, color: "from-pink-500/20 to-red-500/20", border: "hover:border-pink-500/50", text: "text-pink-400" },
                { label: "GitHub", href: GITHUB, icon: <FaGithub size={28} />, color: "from-indigo-500/20 to-violet-500/20", border: "hover:border-indigo-500/50", text: "text-indigo-400" },
                { label: "LinkedIn", href: "https://linkedin.com", icon: <FaLinkedin size={28} />, color: "from-violet-500/20 to-purple-500/20", border: "hover:border-violet-500/50", text: "text-violet-400" },
                { label: "LeetCode", href: "https://leetcode.com", icon: <SiLeetcode size={28} />, color: "from-amber-500/20 to-yellow-500/20", border: "hover:border-amber-500/50", text: "text-amber-400" },
              ].map((c) => (
                <motion.a key={c.label} href={c.href} target="_blank" rel="noreferrer" whileHover={{ y: -4 }}
                  className={`flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl ${c.border} transition-all duration-300 group`}>
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform`}>
                    {c.icon}
                  </div>
                  <span className="text-gray-300 font-medium text-sm">{c.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-16 sm:mt-24 pt-6 sm:pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto text-gray-500 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Anant Tripathi. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </section>
    </div>
  );
}
