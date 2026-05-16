import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BASE_URL } from "../utils/utils"
import "./Gallery.css"
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryDetail() {
    const [gallery, setgallery] = useState({})
    const [allGalleries, setAllGalleries] = useState([])
    const [desc, setdesc] = useState("")
    const [images, setimages] = useState([])
    const [title, settitle] = useState("")
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    
    // States for fullscreen modal
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [zoomScale, setZoomScale] = useState(1)

    // States for swipe/drag and pan
    const [startX, setStartX] = useState(null)
    const [endX, setEndX] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    
    const [panX, setPanX] = useState(0)
    const [panY, setPanY] = useState(0)
    const [startPanX, setStartPanX] = useState(0)
    const [startPanY, setStartPanY] = useState(0)

    const { id } = useParams()

    async function fetchGallery() {
        const res = await fetch("https://lawaggg.github.io/api/v1/SPES-Galery.json");
        const data = await res.json()
        setAllGalleries(data)
        const found = data.find(item => item.id === Number(id))
        if(found) {
            setgallery(found)
            setdesc(found.description)
            settitle(found.title)
            setCurrentSlide(0)

            // Gabung gambar jadi array
            const imageArray = [
                found.image_url_1,
                found.image_url_2,
                found.image_url_3,
            ].filter(img => img)

            setimages(imageArray)
        }
    }

    useEffect(() => {
        fetchGallery()
    }, [id])

    const currentIndexInAll = allGalleries.findIndex(item => item.id === Number(id))
    const prevGallery = currentIndexInAll > 0 ? allGalleries[currentIndexInAll - 1] : null
    const nextGallery = currentIndexInAll < allGalleries.length - 1 ? allGalleries[currentIndexInAll + 1] : null

    const prevSlide = () => {
        if (isTransitioning || images.length <= 1) return
        setIsTransitioning(true)
        setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        setZoomScale(1)
        setPanX(0)
        setPanY(0)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const nextSlide = () => {
        if (isTransitioning || images.length <= 1) return
        setIsTransitioning(true)
        setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
        setZoomScale(1)
        setPanX(0)
        setPanY(0)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide || images.length <= 1) return
        setIsTransitioning(true)
        setCurrentSlide(index)
        setZoomScale(1)
        setPanX(0)
        setPanY(0)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const openFullscreen = (index) => {
        goToSlide(index)
        setIsFullscreen(true)
        setZoomScale(1)
        setPanX(0)
        setPanY(0)
    }

    const closeFullscreen = () => {
        setIsFullscreen(false)
        setZoomScale(1)
        setPanX(0)
        setPanY(0)
    }

    const zoomIn = (e) => {
        e && e.stopPropagation()
        setZoomScale(prev => Math.min(prev + 0.5, 4))
    }
    
    const zoomOut = (e) => {
        e && e.stopPropagation()
        setZoomScale(prev => {
            const newZoom = Math.max(prev - 0.5, 1)
            if (newZoom === 1) {
                setPanX(0)
                setPanY(0)
            }
            return newZoom
        })
    }

    // Pointer events for swipe and pan
    const handlePointerDown = (e) => {
        setIsDragging(true)
        setStartX(e.clientX)
        setEndX(null)
        setStartPanX(e.clientX)
        setStartPanY(e.clientY)
        if(e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e) => {
        if (!isDragging) return
        
        if (zoomScale > 1) {
            // Panning if zoomed in
            const deltaX = e.clientX - startPanX
            const deltaY = e.clientY - startPanY
            setPanX(prev => prev + deltaX)
            setPanY(prev => prev + deltaY)
            setStartPanX(e.clientX)
            setStartPanY(e.clientY)
        } else {
            // Swipe for next/prev
            setEndX(e.clientX)
        }
    }

    const handlePointerUp = (e) => {
        setIsDragging(false)
        if(e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId)
        
        const minSwipeDistance = 50
        if (zoomScale === 1 && startX !== null && endX !== null) {
            const distance = startX - endX
            if (distance > minSwipeDistance) nextSlide()
            else if (distance < -minSwipeDistance) prevSlide()
        }
        
        setStartX(null)
        setEndX(null)
    }

    const handleWheel = (e) => {
        if (e.deltaY < 0) {
            zoomIn()
        } else {
            zoomOut()
        }
    }

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isFullscreen) closeFullscreen()
            if (e.key === "ArrowLeft") prevSlide()
            if (e.key === "ArrowRight") nextSlide()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [images, isFullscreen, isTransitioning])

    return (
        <motion.div 
            className="GalleryContentBg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Floating Desktop Navigation */}
            <div className="FloatingNav desktop-only">
                {prevGallery && (
                    <Link to={`/gallery/${prevGallery.id}`} className="float-btn prev">
                        <div className="float-icon">&larr;</div>
                        <div className="float-content">
                            <span className="float-label">Previous Memory</span>
                            <span className="float-title">{prevGallery.title}</span>
                        </div>
                    </Link>
                )}
                {nextGallery && (
                    <Link to={`/gallery/${nextGallery.id}`} className="float-btn next">
                        <div className="float-icon">&rarr;</div>
                        <div className="float-content">
                            <span className="float-label">Next Memory</span>
                            <span className="float-title">{nextGallery.title}</span>
                        </div>
                    </Link>
                )}
            </div>

            <div className="GalleryDetailContent">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/galleries" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', marginBottom: '1rem' }}>
                        &larr; Back to Gallery
                    </Link>
                </motion.div>
                
                <div className="DetailGallery">
                    <motion.div 
                        className="detailsImage"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <h1>{title}</h1>
                        <p>{desc}</p>
                    </motion.div>

                    <motion.div 
                        className="ImagesList"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className="carousel-wrapper" style={{ cursor: 'pointer' }}>
                            {images.length > 0 && (
                                <>
                                    <div
                                        className={`carousel-container ${isTransitioning ? 'transitioning' : ''}`}
                                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                        onClick={() => openFullscreen(currentSlide)}
                                    >
                                        {images.map((image, index) => (
                                            <div key={index} className="carousel-slide">
                                                <img
                                                    src={image}
                                                    draggable="false"
                                                    alt={`Image ${index + 1}`}
                                                    className="loaded"
                                                    onLoad={(e) => e.target.classList.add('loaded')}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Navigation Buttons */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                className="carousel-btn left"
                                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                                disabled={isTransitioning}
                                            >
                                                &#10094;
                                            </button>
                                            <button
                                                className="carousel-btn right"
                                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                                disabled={isTransitioning}
                                            >
                                                &#10095;
                                            </button>

                                            {/* Indicator Dots */}
                                            <div className="carousel-indicators">
                                                {images.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                                                        onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Global Gallery Navigation - Mobile/Tablet Only */}
                    <motion.div 
                        className="GalleryNavigation mobile-tablet-only"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <div className="NavContainer">
                            {prevGallery ? (
                                <Link to={`/gallery/${prevGallery.id}`} className="nav-item prev">
                                    <div className="nav-content">
                                        <span className="nav-label">Previous</span>
                                        <span className="nav-title">{prevGallery.title}</span>
                                    </div>
                                    <span className="nav-icon">&larr;</span>
                                </Link>
                            ) : (
                                <div className="nav-item disabled"></div>
                            )}

                            <div className="nav-divider"></div>

                            {nextGallery ? (
                                <Link to={`/gallery/${nextGallery.id}`} className="nav-item next">
                                    <span className="nav-icon">&rarr;</span>
                                    <div className="nav-content">
                                        <span className="nav-label">Next</span>
                                        <span className="nav-title">{nextGallery.title}</span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="nav-item disabled"></div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.95)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                            flexDirection: 'column',
                            overflow: 'hidden',
                            touchAction: 'none'
                        }}
                    >
                        {/* Close Button */}
                        <motion.button 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            onClick={closeFullscreen}
                            style={{ 
                                position: 'absolute', 
                                top: '20px', 
                                right: '30px', 
                                background: 'rgba(255,255,255,0.2)', 
                                color: 'white', 
                                border: 'none', 
                                fontSize: '2rem', 
                                cursor: 'pointer',
                                zIndex: 10000,
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'background 0.3s'
                            }}
                        >
                            &times;
                        </motion.button>
                        
                        {/* Zoom Controls */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            style={{ 
                                position: 'absolute', 
                                bottom: '40px', 
                                display: 'flex', 
                                gap: '20px', 
                                zIndex: 10000,
                                background: 'rgba(0,0,0,0.7)',
                                padding: '10px 20px',
                                borderRadius: '30px',
                            }}
                        >
                            <button onClick={zoomOut} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '1.8rem', cursor: 'pointer' }}>-</button>
                            <span style={{ color: 'white', display: 'flex', alignItems: 'center', fontSize: '1.2rem', minWidth: '60px', justifyContent: 'center' }}>{Math.round(zoomScale * 100)}%</span>
                            <button onClick={zoomIn} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
                        </motion.div>

                        {/* Navigation Buttons for Fullscreen */}
                        {images.length > 1 && zoomScale === 1 && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="carousel-btn left" style={{ position: 'fixed', left: '20px', width: '60px', fontSize: '2rem' }}>&#10094;</button>
                                <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="carousel-btn right" style={{ position: 'fixed', right: '20px', width: '60px', fontSize: '2rem' }}>&#10095;</button>
                            </>
                        )}

                        {/* Image Container */}
                        <div 
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            onWheel={handleWheel}
                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <div style={{ display: 'flex', transition: zoomScale === 1 ? 'transform 0.4s' : 'none', transform: `translateX(-${currentSlide * 100}%)`, width: '100%', height: '100%' }}>
                                {images.map((image, index) => (
                                    <div key={index} style={{ width: '100%', height: '100%', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                                        <motion.img 
                                            src={image} 
                                            draggable="false"
                                            alt={`Fullscreen ${index + 1}`} 
                                            style={{ 
                                                transform: index === currentSlide ? `translate(${panX}px, ${panY}px) scale(${zoomScale})` : 'scale(1)', 
                                                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'
                                            }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
