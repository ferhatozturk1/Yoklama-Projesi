import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

/**
 * LazyImage component for lazy loading images
 * 
 * This component uses the Intersection Observer API to load images
 * only when they are about to enter the viewport.
 */
const LazyImage = ({
  src,
  alt,
  placeholderSrc,
  className,
  width,
  height,
  threshold = 0.1,
  rootMargin = '200px 0px',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)
  
  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    if (!imgRef.current) return
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observerRef.current.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    
    observerRef.current.observe(imgRef.current)
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin])
  
  // Handle image load event
  const handleLoad = (e) => {
    setIsLoaded(true)
    if (onLoad) onLoad(e)
  }
  
  // Handle image error event
  const handleError = (e) => {
    setError(true)
    if (onError) onError(e)
  }
  
  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className || ''}`}
      style={{ 
        width: width || 'auto', 
        height: height || 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Placeholder image */}
      {!isLoaded && (
        <img
          src={placeholderSrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4='}
          alt={alt || ''}
          className={`lazy-image-placeholder ${isLoaded ? 'fade-out' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isLoaded ? 0 : 1
          }}
          width={width}
          height={height}
        />
      )}
      
      {/* Actual image - only load when in viewport */}
      {isInView && !error && (
        <img
          src={src}
          alt={alt || ''}
          className={`lazy-image ${isLoaded ? 'fade-in' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isLoaded ? 1 : 0
          }}
          width={width}
          height={height}
          {...props}
        />
      )}
      
      {/* Error fallback */}
      {error && (
        <div 
          className="lazy-image-error"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f8f8',
            color: '#999',
            fontSize: '14px'
          }}
        >
          <span>Resim yüklenemedi</span>
        </div>
      )}
    </div>
  )
}

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  placeholderSrc: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
}

export default React.memo(LazyImage)