import { useEffect, useState, useRef } from "react";
import NavBar from "../assets/NavBar";
import { BASE_URL } from "../utils/utils";
import { Link } from "react-router-dom";
import Gallery from "./Gallery";
import "@animxyz/core";
import Footer from "../assets/Footer";
import "./Home.css";
import { motion } from "framer-motion";

export default function Home() {
  const [student, setStudent] = useState([]);
  const [gallery, setgallery] = useState([]);
  const [isStudentLoading, setIsStudentLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Framer Motion Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemFadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  useEffect(() => {
    // Deteksi perangkat mobile
    const checkIfMobile = () => {
      return (
        window.matchMedia("(max-width: 768px)").matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )
      );
    };

    setIsMobile(checkIfMobile());

    const handleResize = () => {
      setIsMobile(checkIfMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Interactive Progress States
  const [progressData, setProgressData] = useState([
    { skill: "Web Development", level: 90, originalLevel: 90 },
    { skill: "Mobile Development", level: 35, originalLevel: 35 },
    { skill: "Desktop Development", level: 80, originalLevel: 80 },
    { skill: "Game Development", level: 50, originalLevel: 50 },
    { skill: "Design", level: 30, originalLevel: 30 },
  ]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const progressRef = useRef();
  const timeoutRefs = useRef({});
  const barRefs = useRef([]);

  async function fetchStudent() {
    setIsStudentLoading(true);
    const res = await fetch(
      "https://lawaggg.github.io/api/v1/SPES-Students.json",
    );
    const data = await res.json();
    setStudent(data);
    setIsStudentLoading(false);
  }

  async function fetchGallery() {
    const res = await fetch(
      "https://lawaggg.github.io/api/v1/SPES-Galery.json",
    );
    const data = await res.json();
    setgallery(data);
  }

  useEffect(() => {
    fetchStudent();
    fetchGallery();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => {
      if (progressRef.current) {
        observer.unobserve(progressRef.current);
      }
    };
  }, []);

  // Interactive Progress Functions
  const getPercentageFromMouseX = (e, barElement) => {
    const rect = barElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    return Math.round(percentage);
  };

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    setDraggingIndex(index);

    // Clear existing timeout
    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }

    const barElement = barRefs.current[index];
    const newPercentage = getPercentageFromMouseX(e, barElement);

    const updatedData = [...progressData];
    updatedData[index].level = newPercentage;
    setProgressData(updatedData);
  };

  const handleMouseMove = (e) => {
    if (draggingIndex !== null) {
      const barElement = barRefs.current[draggingIndex];
      const newPercentage = getPercentageFromMouseX(e, barElement);

      const updatedData = [...progressData];
      updatedData[draggingIndex].level = newPercentage;
      setProgressData(updatedData);
    }
  };

  const handleMouseUp = () => {
    if (draggingIndex !== null) {
      // Set timeout to revert back after 1 second
      timeoutRefs.current[draggingIndex] = setTimeout(() => {
        const revertedData = [...progressData];
        revertedData[draggingIndex].level =
          revertedData[draggingIndex].originalLevel;
        setProgressData(revertedData);
        setHoveredIndex(null);
      }, 1000);

      setDraggingIndex(null);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    // Clear any existing timeout when hovering
    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }
  };

  const handleMouseLeave = (index) => {
    if (draggingIndex !== index) {
      setHoveredIndex(null);
    }
  };

  // Add global mouse event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingIndex]);

  useEffect(() => {
    if (isMobile) return;

    const cards = document.querySelectorAll(".factCard-3d");
    const container = document.querySelector(".factsGrid");
    if (!container) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        // Hitung jarak relatif card dari mouse (0-1)
        const distanceX = Math.abs(clientX - cardCenterX) / window.innerWidth;
        const distanceY = Math.abs(clientY - cardCenterY) / window.innerHeight;
        const totalDistance = distanceX + distanceY;

        // Hitung arah rotasi
        const directionX = clientX > cardCenterX ? 1 : -1;
        const directionY = clientY > cardCenterY ? -1 : 1;

        // Atur transformasi
        const rotateY = directionX * distanceX * 20; // Rotasi Y berdasarkan jarak horizontal
        const rotateX = directionY * distanceY * 15; // Rotasi X berdasarkan jarak vertikal
        const translateZ = totalDistance * 50; // Jarak Z berdasarkan total jarak

        card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(${translateZ}px)
      `;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  return (
    <>
      <NavBar></NavBar>
      {/* Header */}
      <div className="Bg-tech">
        <div className="HomePage">
          <motion.div
            className="JsonCard floating-card"
            style={{ position: "relative", overflow: "hidden" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating Light Orb Background */}
            <div
              className="light-orb"
              style={{
                position: "absolute",
                width: "300px",
                height: "300px",
                background:
                  "radial-gradient(circle, rgba(79,195,247,0.8) 0%, rgba(79,195,247,0) 70%)",
                borderRadius: "50%",
                filter: "blur(30px)",
                animation: "orb-rotate 15s infinite linear",
                top: "-150px",
                left: "-150px",
                zIndex: 0,
              }}
            ></div>

            <div className="template">
              <div className="circles">
                <svg
                  height="40"
                  width="30"
                  xmlns="http://www.w3.org/2000/svg"
                  className="xyz-in"
                  xyz="fade down-1 delay-2"
                >
                  <circle r="15" cx="15" cy="20" fill="red" />
                </svg>
                <svg
                  height="40"
                  width="30"
                  xmlns="http://www.w3.org/2000/svg"
                  className="xyz-in"
                  xyz="fade down-1 delay-4"
                >
                  <circle r="15" cx="15" cy="20" fill="yellow" />
                </svg>
                <svg
                  height="40"
                  width="30"
                  xmlns="http://www.w3.org/2000/svg"
                  className="xyz-in"
                  xyz="fade down-1 delay-6"
                >
                  <circle r="15" cx="15" cy="20" fill="green" />
                </svg>
              </div>
            </div>
            <div className="body" style={{ position: "relative", zIndex: 1 }}>
              <div className="Header" xyz="fade stagger-1 up-3 ease-out-back">
                <div className="text">
                  <motion.h1 
                    className="h1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    Welcome Tooo <br />
                    Command SPES!
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Software Programming And Engineering Specialist 🤩
                  </motion.p>
                </div>
                <motion.div 
                  className="SpesLogo"
                  initial={{ opacity: 0, x: 50, rotate: 10 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div className="Logo">
                    <img src="/pp[1]-2.png" alt="" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Class Details Section */}
      <div className="ClassDetails">
        <motion.section 
          className="moving-border-container classDescription"
          {...fadeInUp}
        >
          <div className="moving-border"></div>
          <div className="descriptionContainer">
            <h2>Siapa Command SPES?</h2>
            <div className="descriptionContent">
              <p>
                SPES (Software Programming and Engineering Specialist) adalah
                salah satu angkatan ke 58 dari jurusan RPL (Rekayasa perangkat
                lunak) yang ada di SMKN 10 Jakarta, fokus pada pengembangan keterampilan pemrograman dan
                rekayasa perangkat lunak tingkat lanjut.
              </p>
              <p>
                Kami membekali siswa dengan pengetahuan praktis dan teori untuk
                menjadi developer profesional siap kerja.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="moving-border-container progressSection interactive-progress"
          ref={progressRef}
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
        >
          <div className="moving-border"></div>
          <h2>Progress Pembelajaran Kami 📊</h2>
          <div className="progressBars">
            {progressData.map((item, i) => (
              <div
                key={i}
                className="progressItem"
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
              >
                <div className="progressLabel">
                  <span>{item.skill}</span>
                  <span
                    className={`progressPercentage ${
                      hoveredIndex === i || draggingIndex === i ? "hovered" : ""
                    }`}
                  >
                    {item.level}%
                  </span>
                </div>
                <div className="progressBarContainer">
                  <div
                    ref={(el) => (barRefs.current[i] = el)}
                    className={`progressBar ${
                      hoveredIndex === i || draggingIndex === i ? "hovered" : ""
                    }`}
                    onMouseDown={(e) => handleMouseDown(e, i)}
                  >
                    <div
                      className={`progressFill ${
                        hoveredIndex === i || draggingIndex === i
                          ? "hovered"
                          : ""
                      }`}
                      style={{
                        width: visible ? `${item.level}%` : "0%",
                        transition:
                          draggingIndex === i
                            ? "background 0.1s ease, box-shadow 0.1s ease"
                            : "width 2s ease, background 0.3s ease, box-shadow 0.3s ease",
                      }}
                    >
                      {/* Drag indicator bulat putih */}
                      <div
                        className={`dragIndicator ${
                          hoveredIndex === i || draggingIndex === i
                            ? "visible"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="moving-border-container funFacts"
          {...fadeInUp}
        >
          <div className="moving-border"></div>
          <h2>Fun Facts!</h2>
          <motion.div 
            className="factsGrid"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: "👨‍💻",
                title: "50+ Projek",
                desc: "Telah menyelesaikan lebih dari 50 tugas projek",
              },
              {
                icon: "🏆",
                title: "Juara LKS",
                desc: "Memenangi berbagai jurusan lomba LKS",
              },
              {
                icon: "🎮",
                title: "Hobi Gaming",
                desc: "ga dimana mana pasti main game..",
              },
              {
                icon: "💡",
                title: "1000+ Jam",
                desc: "Total waktu belajar intensif",
              },
            ].map((fact, index) => (
              <motion.div 
                key={index} 
                className="factCard-3d"
                variants={itemFadeIn}
              >
                <div className="factIcon">{fact.icon}</div>
                <h3>{fact.title}</h3>
                <p>{fact.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>

      <div className="StudentPage">
        <motion.div 
          className={`StudentWrapper ${isStudentLoading ? "vhFull" : ""}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="member"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h1 className="memberTitle">Our Members 🫂!</h1>
            <Link to="/students">View All </Link>
          </motion.div>
          <motion.div 
            className="students"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
          >
            {student
              .filter((item) => item.position !== "Member")
              .map((item, i) => (
                <motion.div 
                  key={i} 
                  className="studentCard"
                  variants={itemFadeIn}
                >
                  <div className="Profile">
                    <img src={item.profile_url} alt="Profile" />
                  </div>
                  <div className="detail">
                    <div className="name">
                      <h2>{item.name}</h2>
                    </div>
                    <div className="pos">
                      <p className="position">{item.position}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="GalleryPage">
        <motion.div 
          className="Galleries"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="images">
            <h1 className="memberTitle">Recent Activities ✨</h1>
            <Link to="/galleries">View All</Link>
          </div>
          <motion.div 
            className="content"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {gallery
              .sort(() => Math.random() - 0.2)
              .slice(0, 6)
              .map((item, i) => {
                return (
                  <motion.div 
                    className="galleryCard" 
                    key={i}
                    variants={itemFadeIn}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <img src={item.image_url_1} alt="Images" />
                  </motion.div>
                );
              })}
          </motion.div>
        </motion.div>
      </div>
      <Footer></Footer>
    </>
  );
}
