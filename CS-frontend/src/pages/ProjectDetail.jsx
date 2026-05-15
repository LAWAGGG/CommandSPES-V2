import { useEffect, useState } from "react"
import { data, Link, useParams } from "react-router-dom"
import { BASE_URL, getLanguageLogo } from "../utils/utils"
import "./Project.css";
import { motion } from "framer-motion";

export default function ProjectDetail() {
    const [project, setProject] = useState({})
    const { id } = useParams()

    async function fetchProject() {
        const res = await fetch("https://lawaggg.github.io/api/v1/SPES-Project.json");
        const data = await res.json()
        const found = data.find(item => item.id === Number(id))
        setProject(found)
    }

    useEffect(() => {
        fetchProject()
    }, [])

    return (
        <motion.div 
            className="ProjectPage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="ProjectImage">
                <Link className="back" to="/projects">&larr; Back</Link>
                <motion.img 
                    src={project.image_url} 
                    alt="Project Image" 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
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
        </motion.div>
    )
}