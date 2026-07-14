import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import Home from './pages/Home'
import Squad from './pages/Squad'
import Matches from './pages/Matches'
import Stadium from './pages/Stadium'
import PageTransition from './components/PageTransition'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <>
      <Cursor />
      <Navbar />
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/stadium" element={<Stadium />} />
        </Routes>
      </PageTransition>
    </>
  )
}

export default App
