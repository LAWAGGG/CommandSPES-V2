import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectImage = ({ src, alt, className, style, isDetail = false, ...motionProps }) => {
    const [error, setError] = useState(false);
    
    // Check if src is valid
    const hasImage = src && src !== "" && src !== "null" && !error;

    if (!hasImage) {
        return (
            <motion.div 
                className={`ProjectPlaceholder ${className || ''} ${isDetail ? 'detail' : ''}`} 
                style={style}
                {...motionProps}
            >
                <div className="placeholder-content">
                    <div className="placeholder-icon">
                        {isDetail ? "📁" : ""}
                    </div>
                    <div className="placeholder-text">
                        {alt || "Project Image"}
                    </div>
                </div>
                <div className="placeholder-glow"></div>
            </motion.div>
        );
    }

    return (
        <motion.img 
            src={src} 
            alt={alt} 
            className={className} 
            style={style} 
            onError={() => setError(true)}
            draggable="false"
            {...motionProps}
        />
    );
};

export default ProjectImage;
