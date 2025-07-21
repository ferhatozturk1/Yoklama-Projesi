import React from 'react'
import { validatePasswordStrength } from '../../utils/validationUtils'
import './PasswordStrengthIndicator.css'

/**
 * Component that shows password strength with visual indicator
 */
const PasswordStrengthIndicator = ({ 
  password, 
  showFeedback = true,
  className = '' 
}) => {
  const { score, feedback, isValid } = validatePasswordStrength(password)
  
  if (!password) return null
  
  const getStrengthLabel = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'Çok Zayıf'
      case 2:
        return 'Zayıf'
      case 3:
        return 'Orta'
      case 4:
        return 'Güçlü'
      case 5:
        return 'Çok Güçlü'
      default:
        return 'Bilinmiyor'
    }
  }
  
  const getStrengthClass = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'very-weak'
      case 2:
        return 'weak'
      case 3:
        return 'medium'
      case 4:
        return 'strong'
      case 5:
        return 'very-strong'
      default:
        return 'very-weak'
    }
  }
  
  return (
    <div className={`password-strength ${className}`}>
      <div className="password-strength__bar">
        <div className="password-strength__label">
          Şifre Gücü: <span className={`strength-${getStrengthClass(score)}`}>
            {getStrengthLabel(score)}
          </span>
        </div>
        
        <div className="password-strength__progress">
          <div className="password-strength__track">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`password-strength__segment ${
                  level <= score ? `active strength-${getStrengthClass(score)}` : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {showFeedback && feedback.length > 0 && (
        <div className="password-strength__feedback">
          <ul className="password-strength__feedback-list">
            {feedback.map((item, index) => (
              <li 
                key={index} 
                className={`password-strength__feedback-item ${
                  isValid ? 'success' : 'error'
                }`}
              >
                <span className="password-strength__feedback-icon">
                  {isValid ? '✓' : '•'}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PasswordStrengthIndicator