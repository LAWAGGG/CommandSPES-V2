import { useEffect, useState } from "react"
import { BASE_URL } from "../utils/utils"
import { Link, useParams } from "react-router-dom"
import "./Student.css";
import { motion } from "framer-motion";

export default function StudentDetail() {
    const [student, setStudent] = useState({})
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    async function fetchStudent() {
        setLoading(true)
       const res = await fetch("https://lawaggg.github.io/api/v1/SPES-Students.json");
        const data = await res.json()
        const found = data.find(item => item.id === id)
        setStudent(found || {})
        setLoading(false)
    }

    useEffect(() => {
        fetchStudent()
    }, [])

    return (
        <>
            <div className={`StudentDetailPage ${loading ? "loading" : ""}`}>
                <div className="StudentBg">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link className="backButton" to="/students">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Students
                        </Link>
                    </motion.div>

                    {!loading && student && (
                        <motion.div 
                            className="StudentDetailCard"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="StudentImage">
                                <img src={student.profile_url} alt={student.name} />
                                <div className="imageOverlay"></div>
                                <motion.div 
                                    className="studentBadge"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                >
                                    {student.position}
                                </motion.div>
                            </div>
                            <div className="DetailProfile">
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >{student.name}</motion.h1>
                                <div className="studentMeta">
                                    <span className="metaItem">
                                        {/* SVG ... */}
                                        {student.gender == "L" ? "Laki laki" : "Perempuan"}
                                    </span>
                                    {/* ... other meta items */}
                                </div>

                                <motion.div 
                                    className="studentBio"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3>About Me</h3>
                                    <p>{student.description}</p>
                                </motion.div>

                                <motion.div 
                                    className="studentSkills"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3>Skills</h3>
                                    <div className="skillsList">
                                        {student.skill?.split(',').map((skill, i) => (
                                            <motion.span 
                                                key={i} 
                                                className="skillTag"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + (i * 0.1) }}
                                            >{skill.trim()}</motion.span>
                                        ))}
                                    </div>
                                </motion.div>

                                {student.sosmed && (
                                    <motion.a 
                                        href={student.sosmed} 
                                        rel="noopener noreferrer" 
                                        className="socialButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Connect on Social Media 😁
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    )
}