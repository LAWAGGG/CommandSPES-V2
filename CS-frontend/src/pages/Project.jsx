import { useEffect, useState } from "react"
import { BASE_URL } from "../utils/utils";
import { Link } from "react-router-dom";
import NavBar from "../assets/NavBar";
import Footer from "../assets/Footer";
import "./Project.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Project() {
    const [project, setProject] = useState(() => {
        const cached = sessionStorage.getItem('projectData');
        return cached ? JSON.parse(cached) : [];
    });
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(() => !sessionStorage.getItem('projectData'))

    async function fetchProject() {
        if (!sessionStorage.getItem('projectData')) setLoading(true);
        try {
            const res = await fetch("https://lawaggg.github.io/api/v1/SPES-Project.json");
            const data = await res.json();
            setProject(data);
            sessionStorage.setItem('projectData', JSON.stringify(data));
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProject()
    }, [])

    const filteredProject = project.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <NavBar></NavBar>
            <div className={`ProjectContent ${loading ? "loading" : ""}`}>
                <div className="ProjectWrapper">
                    <motion.div 
                        className="projectHeader"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="headerContent">
                            <h1>Our Projects Gallery</h1>
                            <p>Explore the innovative work created by our talented students</p>
                            <div className="searchBar">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search projects..."
                                />
                                <svg className="searchIcon" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="projects"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProject.length > 0 ? (
                                filteredProject.map((item, i) => (
                                    <motion.div
                                        key={item.id || i}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ y: -10 }}
                                    >
                                        <Link to={`/project/${item.id}`} style={{ textDecoration: 'none' }}>
                                            <div className="ProjectCard">
                                                <div className="ProjectImages">
                                                    <img src={item.image_url} alt={item.title} />
                                                    <div className="imageOverlay"></div>
                                                </div>
                                                <div className="ProjectDetail">
                                                    <h2>{item.title}</h2>
                                                    <div className="languages">
                                                        {item.language.split("\n").map((lang, i) => {
                                                            const langClass = lang.toLowerCase().replace(/#/g, 's');
                                                            return (
                                                                <span key={i} className={`${langClass}`}>
                                                                    {lang}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    className="noResults"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <h3>No projects found</h3>
                                    <p>Try a different search term</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}