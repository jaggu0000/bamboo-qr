import React, { useState, useMemo, useEffect } from 'react'
import './Home.css'

import rectangleImg from '../assets/rectangle.png'
import cylinderImg from '../assets/cylinder.png'
import ovalImg from '../assets/oval.png'

/* ─── Thermochromic color stops ─── */
const PURPLE = { r: 136, g: 13,  b: 173 } // #880DAD
const RED    = { r: 230, g: 30,  b: 30  } // #E61E1E
const BLACK  = { r: 14,  g: 14,  b: 14  } // #0E0E0E

function lerpColor(a, b, t) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  }
}

function getThermochromicColor(temp) {
  if (temp <= 25) {
    return PURPLE
  } else if (temp <= 65) {
    const t = (temp - 25) / (65 - 25)
    return lerpColor(PURPLE, RED, t)
  } else {
    const t = Math.min((temp - 65) / (100 - 65), 1)
    return lerpColor(RED, BLACK, t)
  }
}

function rgbStr(c) {
  return `rgb(${c.r}, ${c.g}, ${c.b})`
}

/* ─── Shape data ─── */
const SHAPES = [
  { id: 'rectangle', label: 'RECTANGLE', img: rectangleImg },
  { id: 'cylinder',  label: 'CYLINDER',  img: cylinderImg },
  { id: 'oval',      label: 'OVAL',      img: ovalImg },
]

/* ─── Size data ─── */
const SIZES = [
  { id: 'small', name: 'Small', dims: '18x14x5cm', price: 10 },
  { id: 'large', name: 'Large', dims: '20x16x7cm', price: 12 },
]

const Home = () => {
  const [shape, setShape] = useState('rectangle')
  const [size, setSize] = useState('small')
  const [temp, setTemp] = useState(35)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Set initial theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  /* Thermochromic derived values */
  const thermoColor = useMemo(() => getThermochromicColor(temp), [temp])
  const thermoColorStr = rgbStr(thermoColor)
  const sliderPercent = (temp / 100) * 100

  /* Build the showcase background gradient from the thermochromic core */
  const showcaseBg = useMemo(() => {
    const c = thermoColor
    const baseOpacity = isDark ? 0.35 : 1
    const deepOpacity = isDark ? 0.55 : 0.55
    const base = `rgba(${c.r}, ${c.g}, ${c.b}, ${baseOpacity})`
    const deep = `rgba(${Math.max(c.r - 40, 0)}, ${Math.max(c.g - 10, 0)}, ${Math.max(c.b - 20, 0)}, ${deepOpacity})`
    return `radial-gradient(ellipse at 50% 40%, ${base} 0%, ${deep} 60%, var(--surface-container-low) 100%)`
  }, [thermoColor, isDark])

  const currentShapeImg = SHAPES.find(s => s.id === shape)?.img

  return (
    <div className="home-page">
      {/* ─── Nav ─── */}
      <nav className="nav fade-in fade-in-d1" id="main-nav">
        <div className="nav-brand">Bamboo Container</div>
        <button
          className="theme-toggle"
          id="theme-toggle-btn"
          onClick={() => setIsDark(d => !d)}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero" id="hero-section">
        {/* Left column */}
        <div className="hero-left">
          <div
            className="product-showcase fade-in fade-in-d2"
            id="product-showcase"
            style={{ background: showcaseBg }}
          >
            {/* Temperature badge */}
            <div className="temp-badge" style={{ borderColor: `rgba(${thermoColor.r}, ${thermoColor.g}, ${thermoColor.b}, 0.25)` }}>
              <span>{temp}°C</span>
            </div>

            {/* Product image with crossfade */}
            <div className="image-crossfade" data-size={size}>
              {SHAPES.map(s => (
                <img
                  key={s.id}
                  src={s.img}
                  alt={`Bamboo container – ${s.label}`}
                  className={s.id === shape ? 'active-image' : ''}
                />
              ))}
            </div>
          </div>

          {/* Heat simulation slider */}
          <div className="heat-panel fade-in fade-in-d3" id="heat-slider-panel">
            <div className="heat-header">
              <span className="heat-label">Ambient Heat Simulation</span>
              <span
                className="heat-value"
                style={{ color: thermoColorStr }}
              >
                {temp}°C
              </span>
            </div>

            <div className="slider-container">
              <div className="slider-track">
                <div
                  className="slider-fill"
                  style={{
                    width: `${sliderPercent}%`,
                    background: `linear-gradient(90deg, ${rgbStr(PURPLE)}, ${thermoColorStr})`,
                  }}
                />
              </div>
              <input
                id="heat-slider"
                type="range"
                className="slider-input"
                min={0}
                max={100}
                value={temp}
                onChange={e => setTemp(Number(e.target.value))}
                style={{
                  '--thumb-color': thermoColorStr,
                }}
              />
            </div>

            <div className="slider-labels">
              <span>0°C</span>
              <span>100°C</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="hero-right">
          <div>
            <h1 className="product-title fade-in fade-in-d2">
              Bamboo<br />Container
            </h1>
            <p className="product-description fade-in fade-in-d3">
              Smart temperature-indicating eco-friendly storage.
              The bamboo exterior reacts to internal heat, altering
              its hue from vibrant ultraviolet to deep crimson
              and obsidian.
            </p>
          </div>

          {/* Form Factor */}
          <div className="fade-in fade-in-d4" id="form-factor-section">
            <p className="section-label">Form Factor</p>
            <div className="form-factor-toggle" role="radiogroup" aria-label="Form factor">
              {SHAPES.map(s => (
                <button
                  key={s.id}
                  id={`shape-${s.id}`}
                  className={`toggle-option ${shape === s.id ? 'active' : ''}`}
                  role="radio"
                  aria-checked={shape === s.id}
                  onClick={() => setShape(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div className="capacity-section fade-in fade-in-d5" id="capacity-section">
            <p className="section-label">Capacity &amp; Dimensions</p>
            <div className="capacity-cards">
              {SIZES.map(sz => (
                <button
                  key={sz.id}
                  id={`size-${sz.id}`}
                  className={`capacity-card${size === sz.id ? ' selected' : ''} text-left`}
                  onClick={() => setSize(sz.id)}
                  aria-pressed={size === sz.id}
                >
                  <div className="capacity-card-header">
                    <span className="capacity-name">{sz.name}</span>
                    <span className="check-icon">✓</span>
                  </div>
                  <p className="capacity-dims">{sz.dims}</p>
                  <p className="capacity-price">₹{sz.price}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Home
