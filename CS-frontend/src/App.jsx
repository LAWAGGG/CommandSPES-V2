import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Student from './pages/Student'
import Project from './pages/Project'
import Gallery from './pages/Gallery'
import StudentDetail from './pages/StudentDetail'
import GalleryDetail from './pages/GalleryDetail'
import ProjectDetail from './pages/ProjectDetail'
import ScrollToTop from './ScrollToTop'

function App() {
 

  return (
    <>
      <ScrollToTop />
      <Routes>
          <Route path="/" element={<Home></Home>}/>
          <Route path="/students" element={<Student></Student>}/>
          <Route path="/students/:id" element={<StudentDetail></StudentDetail>}/>
          <Route path="/projects" element={<Project></Project>}/>
          <Route path="/project/:id" element={<ProjectDetail></ProjectDetail>}/>
          <Route path="/gallery/:id" element={<GalleryDetail></GalleryDetail>}/>
          <Route path="/galleries" element={<Gallery></Gallery>}/>
      </Routes>
    </>
  )
}

export default App
