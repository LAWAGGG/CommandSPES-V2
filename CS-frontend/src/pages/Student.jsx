import { useEffect, useState } from "react"
import { BASE_URL } from "../utils/utils";
import { Link } from "react-router-dom";
import NavBar from "../assets/NavBar";
import Footer from "../assets/Footer";
import "./Student.css";
import { motion } from "framer-motion";

export default function Student() {
    const [student, setStudent] = useState(() => {
        const cached = sessionStorage.getItem('studentData');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(() => !sessionStorage.getItem('studentData'))

    // Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    async function fetchStudent() {
        if (!sessionStorage.getItem('studentData')) setLoading(true);
        try {
            const res = await fetch("https://lawaggg.github.io/api/v1/SPES-Students.json");
            const data = await res.json();
            setStudent(data);
            sessionStorage.setItem('studentData', JSON.stringify(data));
        } catch (error) {
            console.error("Error fetching student:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudent()
    }, [])

    return (
        <>
            <NavBar></NavBar>
            <div className={`StudentContent ${loading ? "loading" : ""}`}>
                <div className="StudentWrappers">
                    <motion.div 
                        className="Explain"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1>Our Awesome Members!</h1>
                        <p>Meet the talented individuals of RPL58 class! Cool looks, brilliant minds 🥶✨</p>
                    </motion.div>
                    <motion.div 
                        className="student"
                        variants={containerVariants}
                        initial="hidden"
                        animate={loading ? "hidden" : "visible"}
                    >
                        {student.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={cardVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={`/students/${item.id}`}
                                >
                                    <div className="StudentCard">
                                        <div className="StudentProfile">
                                            <img src={item.profile_url} alt={item.name} />
                                            <div className="profile-overlay"></div>
                                        </div>
                                        <div className="StudentDetail">
                                            <div className="names">
                                                <p>{item.name}</p>
                                                <p className="position-tag">{item.skill}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}