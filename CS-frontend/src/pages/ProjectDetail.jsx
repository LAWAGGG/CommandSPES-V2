import { useEffect, useState } from "react"
import { data, Link, useParams } from "react-router-dom"
import { BASE_URL, getLanguageLogo } from "../utils/utils"
import "./Project.css";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetail() {
    const [project, setProject] = useState({})
    const { id } = useParams()

    // States for fullscreen modal
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [zoomScale, setZoomScale] = useState(1)
    const [isDragging, setIsDragging] = useState(false)
    const [panX, setPanX] = useState(0)
    const [panY, setPanY] = useState(0)
    const [startPanX, setStartPanX] = useState(0)
    const [startPanY, setStartPanY] = useState(0)

    async function fetchProject() {
        const res = await fetch("https://lawaggg.github.io/api/v1/SPES-Project.json");
        const data = await res.json()
        const found = data.find(item => item.id === Number(id))
        setProject(found)
    }

    useEffect(() => {
        fetchProject()
    }, [])

    const openFullscreen = () => {
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

    const handlePointerDown = (e) => {
        setIsDragging(true)
        setStartPanX(e.clientX)
        setStartPanY(e.clientY)
        if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e) => {
        if (!isDragging || zoomScale <= 1) return

        const deltaX = e.clientX - startPanX
        const deltaY = e.clientY - startPanY
        setPanX(prev => prev + deltaX)
        setPanY(prev => prev + deltaY)
        setStartPanX(e.clientX)
        setStartPanY(e.clientY)
    }

    const handlePointerUp = (e) => {
        setIsDragging(false)
        if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId)
    }

    const handleWheel = (e) => {
        if (e.deltaY < 0) zoomIn()
        else zoomOut()
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isFullscreen) closeFullscreen()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isFullscreen])

    return (
        <motion.div
            className="ProjectPage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="ProjectImage" onClick={openFullscreen} style={{ cursor: 'zoom-in' }}>
                <Link className="back" to="/projects" onClick={(e) => e.stopPropagation()}>&larr; Back</Link>
                <motion.img
                    src={project.image_url}
                    alt="Project Image"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    draggable="false"
                    transition={{ duration: 1.5 }}
                />
            </div>
            <motion.div
                className="ProjectContents"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <div className="DetailProject">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >{project.title}</motion.h1>

                    <p>Teacher:</p>
                    <p>{project.teacher}</p>

                    <p>Creator:</p>
                    <p>{project.creator}</p>

                    <p>Repository:</p>
                    <p>
                        <a href={project.repo_link} rel="noopener noreferrer" style={{ color: '#4fc3f7' }}>
                            GitHub Link
                        </a>
                    </p>

                    <p>Language:</p>
                    <div className="languages">
                        {project.language?.split("\n").map((item, i) => {
                            const logoUrl = getLanguageLogo(item);
                            if (logoUrl) {
                                return (
                                    <motion.img
                                        key={i}
                                        src={logoUrl}
                                        alt={item}
                                        className="lang-logo-detail"
                                        title={item}
                                        draggable="false"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 + (i * 0.1) }}
                                    />
                                )
                            }
                            return null;
                        })}
                    </div>

                    <p>Description :</p>
                    <p className="description-text">{project.description}</p>
                </div>
            </motion.div>

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
                        <button
                            onClick={closeFullscreen}
                            style={{
                                position: 'absolute', top: '20px', right: '30px',
                                background: 'rgba(255,255,255,0.2)', color: 'white',
                                border: 'none', fontSize: '2rem', cursor: 'pointer',
                                zIndex: 10000, width: '50px', height: '50px',
                                borderRadius: '50%', display: 'flex',
                                justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            &times;
                        </button>

                        <div
                            style={{
                                position: 'absolute', bottom: '40px', display: 'flex',
                                gap: '20px', zIndex: 10000, background: 'rgba(0,0,0,0.7)',
                                padding: '10px 20px', borderRadius: '30px',
                            }}
                        >
                            <button onClick={zoomOut} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '1.8rem', cursor: 'pointer' }}>-</button>
                            <span style={{ color: 'white', display: 'flex', alignItems: 'center', fontSize: '1.2rem', minWidth: '60px', justifyContent: 'center' }}>{Math.round(zoomScale * 100)}%</span>
                            <button onClick={zoomIn} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
                        </div>

                        <div
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            onWheel={handleWheel}
                            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <motion.img
                                src={project.image_url}
                                alt="Fullscreen Project"
                                draggable="false"
                                style={{
                                    transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`,
                                    maxWidth: '90%', maxHeight: '90%', objectFit: 'contain',
                                    cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}