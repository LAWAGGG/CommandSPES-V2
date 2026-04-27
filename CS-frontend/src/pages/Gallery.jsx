import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../utils/utils";
import { Link } from "react-router-dom";
import NavBar from "../assets/NavBar";
import "./Gallery.css";
import Footer from "../assets/Footer";
import { motion } from "framer-motion";

export default function Gallery() {
  const [gallery, setGallery] = useState(() => {
    const cached = sessionStorage.getItem("galleryData");
    return cached ? JSON.parse(cached) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(
    () => !sessionStorage.getItem("galleryData"),
  );
  const timeoutRef = useRef(null);
  const animationRefs = useRef([]);

  async function fetchGallery() {
    if (!sessionStorage.getItem("galleryData")) setLoading(true);
    try {
      const res = await fetch(
        "https://lawaggg.github.io/api/v1/SPES-Galery.json",
      );
      const data = await res.json();
      setGallery(data);
      sessionStorage.setItem("galleryData", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGallery();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const addToRefs = (el) => {
    if (el && !animationRefs.current.includes(el)) {
      animationRefs.current.push(el);
    }
  };

  // Auto slide sesuai settingan asli Anda
  useEffect(() => {
    if (gallery.length > 0) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 3000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, gallery]);

  return (
    <>
      <NavBar />
      <div className="GalleryContent">
        <div className="GalleryWrapper">
          <motion.div
            className="carousel-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="carouselTitle">A day in Rpl Class!</h1>
            {/* Kembali ke settingan asli Anda tanpa Framer di dalam wrapper ini */}
            <div className="single-carousel-wrapper">
              <span className="ribbon-decoration top-left"></span>
              <span className="emoji-decoration top-right"></span>
              <span className="laugh-decoration bottom-left"></span>
              <span className="heart-decoration bottom-right"></span>

              <button onClick={prevSlide} className="carousel-btn left">
                &#10094;
              </button>

              {loading ? (
                <div className="single-slide skeleton-slide">
                  <div className="skeleton-image"></div>
                </div>
              ) : (
                gallery.length > 0 && (
                  <div className="single-slide">
                    <img
                      src={gallery[currentIndex].image_url_1}
                      alt={gallery[currentIndex].title}
                    />
                  </div>
                )
              )}

              <button onClick={nextSlide} className="carousel-btn right">
                &#10095;
              </button>
            </div>
          </motion.div>

          <div className="List-page">
            <motion.div
              className="desc"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="galleryTitle">Our Memories ✨</h1>
              <p>
                Waktu yang sudah datang tidak akan kembali lagi, oleh karena itu
                banyakkan memori foto bersamaa...
              </p>
            </motion.div>

            <div className="gallery-list">
              {loading
                ? Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        ref={addToRefs}
                        className="GalleryCard skeleton-card fade-in"
                      >
                        <div className="skeleton-image"></div>
                      </div>
                    ))
                : gallery.map((item, i) => (
                    <Link
                      to={`/gallery/${item.id}`}
                      key={i}
                      ref={addToRefs}
                      className="GalleryCard fade-in"
                    >
                      <img src={item.image_url_1} alt={item.title} />
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
