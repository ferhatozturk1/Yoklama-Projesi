/**
 * Image Optimizer Utility
 * 
 * This utility provides functions for optimizing images before upload
 * and generating responsive image URLs.
 */

/**
 * Resize an image to specified dimensions
 * @param {File|Blob} file - Image file or blob
 * @param {Object} options - Resize options
 * @param {number} options.maxWidth - Maximum width
 * @param {number} options.maxHeight - Maximum height
 * @param {number} options.quality - JPEG quality (0-1)
 * @param {string} options.format - Output format (jpeg, png, webp)
 * @returns {Promise<Blob>} - Resized image blob
 */
export const resizeImage = async (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'jpeg'
  } = options
  
  return new Promise((resolve, reject) => {
    // Create file reader
    const reader = new FileReader()
    
    reader.onload = (event) => {
      // Create image element
      const img = new Image()
      
      img.onload = () => {
        // Calculate dimensions
        let width = img.width
        let height = img.height
        
        // Resize if needed
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }
        
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                         format === 'png' ? 'image/png' : 
                         'image/webp'
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to convert canvas to blob'))
            }
          },
          mimeType,
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      // Set image source
      img.src = event.target.result
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    // Read file as data URL
    reader.readAsDataURL(file)
  })
}

/**
 * Compress an image to reduce file size
 * @param {File|Blob} file - Image file or blob
 * @param {Object} options - Compression options
 * @param {number} options.quality - JPEG quality (0-1)
 * @param {number} options.maxSizeKB - Maximum size in KB
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = async (file, options = {}) => {
  const {
    quality = 0.8,
    maxSizeKB = 500
  } = options
  
  // If file is already small enough, return it
  if (file.size <= maxSizeKB * 1024) {
    return file
  }
  
  // Start with high quality
  let currentQuality = quality
  let result = await resizeImage(file, { quality: currentQuality })
  
  // Reduce quality until file size is acceptable or quality is too low
  while (result.size > maxSizeKB * 1024 && currentQuality > 0.1) {
    currentQuality -= 0.1
    result = await resizeImage(file, { quality: currentQuality })
  }
  
  return result
}

/**
 * Generate responsive image srcset
 * @param {string} baseUrl - Base image URL
 * @param {Array} sizes - Array of sizes (widths)
 * @returns {string} - srcset attribute value
 */
export const generateSrcSet = (baseUrl, sizes = [320, 640, 960, 1280, 1920]) => {
  if (!baseUrl) return ''
  
  // Parse URL to add width parameter
  const url = new URL(baseUrl, window.location.origin)
  
  return sizes
    .map(size => {
      const sizeUrl = new URL(url)
      sizeUrl.searchParams.set('w', size)
      return `${sizeUrl.toString()} ${size}w`
    })
    .join(', ')
}

/**
 * Create a thumbnail from an image
 * @param {File|Blob} file - Image file or blob
 * @param {Object} options - Thumbnail options
 * @param {number} options.width - Thumbnail width
 * @param {number} options.height - Thumbnail height
 * @returns {Promise<Blob>} - Thumbnail blob
 */
export const createThumbnail = async (file, options = {}) => {
  const {
    width = 100,
    height = 100
  } = options
  
  return resizeImage(file, {
    maxWidth: width,
    maxHeight: height,
    quality: 0.7,
    format: 'jpeg'
  })
}

/**
 * Convert image to base64 data URL
 * @param {File|Blob} file - Image file or blob
 * @returns {Promise<string>} - Base64 data URL
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      resolve(event.target.result)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to convert image to base64'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Get image dimensions
 * @param {File|Blob|string} source - Image file, blob or URL
 * @returns {Promise<Object>} - Image dimensions { width, height }
 */
export const getImageDimensions = (source) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    if (typeof source === 'string') {
      img.src = source
    } else {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        img.src = event.target.result
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(source)
    }
  })
}

export default {
  resizeImage,
  compressImage,
  generateSrcSet,
  createThumbnail,
  imageToBase64,
  getImageDimensions
}