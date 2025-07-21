/**
 * API response validation utility
 * 
 * This module provides utilities for validating API responses.
 */

/**
 * Validate API response schema
 * @param {Object} response - API response
 * @param {Object} schema - Expected schema
 * @returns {boolean} - Whether response is valid
 */
export const validateResponseSchema = (response, schema) => {
  if (!response || !schema) return false
  
  // Check required fields
  for (const field of schema.required || []) {
    if (response[field] === undefined) {
      console.error(`API response validation failed: Missing required field '${field}'`)
      return false
    }
  }
  
  // Check field types
  for (const [field, type] of Object.entries(schema.types || {})) {
    if (response[field] !== undefined) {
      const actualType = Array.isArray(response[field]) ? 'array' : typeof response[field]
      
      if (actualType !== type) {
        console.error(`API response validation failed: Field '${field}' should be of type '${type}', but got '${actualType}'`)
        return false
      }
    }
  }
  
  // Check nested objects
  for (const [field, nestedSchema] of Object.entries(schema.nested || {})) {
    if (response[field] !== undefined) {
      if (typeof response[field] !== 'object' || response[field] === null) {
        console.error(`API response validation failed: Field '${field}' should be an object`)
        return false
      }
      
      if (!validateResponseSchema(response[field], nestedSchema)) {
        return false
      }
    }
  }
  
  // Check array items
  for (const [field, itemSchema] of Object.entries(schema.arrays || {})) {
    if (Array.isArray(response[field])) {
      for (const item of response[field]) {
        if (!validateResponseSchema(item, itemSchema)) {
          return false
        }
      }
    }
  }
  
  return true
}

/**
 * Create schema for API response validation
 * @param {Object} options - Schema options
 * @returns {Object} - Schema object
 */
export const createResponseSchema = (options) => {
  return {
    required: options.required || [],
    types: options.types || {},
    nested: options.nested || {},
    arrays: options.arrays || {}
  }
}

/**
 * Common response schemas
 */
export const responseSchemas = {
  // Authentication schemas
  auth: {
    login: createResponseSchema({
      required: ['token', 'refreshToken', 'user'],
      types: {
        token: 'string',
        refreshToken: 'string'
      },
      nested: {
        user: {
          required: ['id', 'email'],
          types: {
            id: 'string',
            email: 'string',
            firstName: 'string',
            lastName: 'string'
          }
        }
      }
    }),
    
    user: createResponseSchema({
      required: ['id', 'email'],
      types: {
        id: 'string',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        title: 'string',
        university: 'string',
        faculty: 'string',
        department: 'string'
      }
    })
  },
  
  // Course schemas
  course: {
    list: createResponseSchema({
      required: ['data'],
      types: {
        data: 'array'
      },
      arrays: {
        data: {
          required: ['id', 'name', 'code'],
          types: {
            id: 'string',
            name: 'string',
            code: 'string'
          }
        }
      }
    }),
    
    detail: createResponseSchema({
      required: ['id', 'name', 'code'],
      types: {
        id: 'string',
        name: 'string',
        code: 'string',
        section: 'string',
        classroom: 'string',
        credits: 'number',
        ects: 'number'
      },
      nested: {
        schedule: {
          types: {
            day: 'string',
            startTime: 'string',
            endTime: 'string'
          }
        }
      }
    })
  },
  
  // Student schemas
  student: {
    list: createResponseSchema({
      required: ['data'],
      types: {
        data: 'array'
      },
      arrays: {
        data: {
          required: ['id', 'name', 'studentId'],
          types: {
            id: 'string',
            name: 'string',
            studentId: 'string'
          }
        }
      }
    })
  },
  
  // Attendance schemas
  attendance: {
    session: createResponseSchema({
      required: ['id', 'courseId', 'sessionDate', 'attendanceData'],
      types: {
        id: 'string',
        courseId: 'string',
        sessionDate: 'string',
        sessionType: 'string',
        attendanceData: 'array'
      },
      arrays: {
        attendanceData: {
          required: ['studentId', 'status'],
          types: {
            studentId: 'string',
            status: 'string'
          }
        }
      }
    }),
    
    history: createResponseSchema({
      required: ['data'],
      types: {
        data: 'array'
      },
      arrays: {
        data: {
          required: ['id', 'sessionDate'],
          types: {
            id: 'string',
            sessionDate: 'string',
            sessionType: 'string'
          }
        }
      }
    })
  }
}

/**
 * Validate API response against schema
 * @param {Object} response - API response
 * @param {Object|string} schema - Schema object or schema name
 * @returns {boolean} - Whether response is valid
 */
export const validateResponse = (response, schema) => {
  // Get schema object
  let schemaObj = schema
  
  if (typeof schema === 'string') {
    const [category, name] = schema.split('.')
    
    if (!responseSchemas[category] || !responseSchemas[category][name]) {
      console.error(`API response validation failed: Schema '${schema}' not found`)
      return false
    }
    
    schemaObj = responseSchemas[category][name]
  }
  
  return validateResponseSchema(response, schemaObj)
}

export default {
  validateResponseSchema,
  createResponseSchema,
  responseSchemas,
  validateResponse
}