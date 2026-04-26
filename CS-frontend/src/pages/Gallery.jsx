import { useEffect, useRef, useState } from "react"
import { BASE_URL } from "../utils/utils"
import { Link } from "react-router-dom"
import NavBar from "../assets/NavBar"
import "/src/gallery.css"
import Footer from "../assets/Footer";

export default function Gallery() {
    const [gallery, setGallery] = useState(() => {
        const cached = sessionStorage.getItem('galleryData');
        return cached ? JSON.parse(cached) : [];
    })
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(() => !sessionStorage.getItem('galleryData'))
    const timeoutRef = useRef(null)
    const animationRefs = useRef([])
    const [selectedImage, setSelectedImage] = useState(null)


    async function fetchGallery() {
        if (!sessionStorage.getItem('galleryData')) setLoading(true);
        try {
            const res = await fetch("https://lawaggg.github.io/api/v1/SPES-Galery.json");
            const data = await res.json()
            setGallery(data)
            sessionStorage.setItem('galleryData', JSON.stringify(data));
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGallery()
    }, [])

    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % gallery.length)
    }

    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + gallery.length) % gallery.length)
    }

    // Auto slide every 4s
    useEffect(() => {
        if (gallery.length > 0) {
            timeoutRef.current = setTimeout(() => {
                nextSlide()
            }, 3000)
        }

        return () => clearTimeout(timeoutRef.current)
    }, [currentIndex, gallery])

    useEffect(() => {
        if (loading) return; // Jangan setup observer saat masih loading

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show')
                        // Optional: Unobserve setelah animasi muncul pertama kali
                        // observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px' // Memicu animasi sedikit sebelum element masuk viewport
            }
        )

        // Gunakan ref untuk element yang perlu dianimasikan
        const elements = animationRefs.current.filter(Boolean)
        elements.forEach(el => observer.observe(el))

        return () => {
            elements.forEach(el => observer.unobserve(el))
        }
    }, [loading]) // Jalankan ulang observer ketika loading selesai

    // Fungsi untuk menambahkan ref ke array refs
    const addToRefs = (el) => {
        if (el && !animationRefs.current.includes(el)) {
            animationRefs.current.push(el)
        }
    }

    return (
        <>
            <NavBar />
            <div className="GalleryContent">
                <div className="GalleryWrapper">
                    <div className="carousel-page fade-in">
                        <h1 className="carouselTitle slide-in-left">A day in Rpl Class!</h1>
                        <div className="single-carousel-wrapper pop-in">
                            <span className="ribbon-decoration top-left"></span>
                            <span className="emoji-decoration top-right"></span>
                            <span className="laugh-decoration bottom-left"></span>
                            <span className="heart-decoration bottom-right"></span>
                            <button onClick={prevSlide} className="carousel-btn left">&#10094;</button>

                            {loading ? (
                                <div className="single-slide skeleton-slide">
                                    <div className="skeleton-image"></div>
                                </div>
                            ) : (
                                gallery.length > 0 && (
                                    <div className="single-slide">
                                        <img src={gallery[currentIndex].image_url_1} alt={gallery[currentIndex].title} />
                                    </div>
                                )
                            )}

                            <button onClick={nextSlide} className="carousel-btn right">&#10095;</button>
                        </div>
                    </div>

                    {/* Gallery list section */}
                    <div className="List-page">
                        <div ref={addToRefs} className="desc fade-in">
                            <h1 className="galleryTitle">Our Memories ✨</h1>
                            <p>Waktu yang sudah datang tidak akan kembali lagi, oleh karena itu banyakkan memori foto bersamaa. Siapa tau mungkin diwaktu kita sudah besar nanti bisa melihat diri kita yang dulu benar-benar bersenang ria tersenyum bersama teman teman kesayangan..</p>
                        </div>
                        <div className="gallery-list">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i}
                                        ref={addToRefs}
                                        className="GalleryCard skeleton-card fade-in">
                                        <div className="skeleton-image"></div>
                                    </div>
                                ))
                            ) : (
                                gallery.map((item, i) => (
                                    <Link
                                        to={`/gallery/${item.id}`}
                                        key={i}
                                        ref={addToRefs}
                                        className="GalleryCard fade-in">
                                        <img src={item.image_url_1} alt={item.title} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
            {selectedImage && (
                <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedImage(null)}>✖</button>

                        <img src={selectedImage.image_url_1} alt={selectedImage.title} className="modal-img" />
                        <h2>{selectedImage.title}</h2>
                        <p>{selectedImage.description}</p>
                    </div>
                </div>
            )}
        </>
    )
}