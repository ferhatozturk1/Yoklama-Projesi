# API Service Modules

This directory contains service modules for interacting with the backend API. Each service module provides methods for specific API endpoints.

## API Client

The `apiClient.js` utility provides a configured Axios instance with:

- Base URL configuration
- Authentication token handling
- Request and response interceptors
- Token refresh logic
- Error handling

## Authentication Service

The `authService.js` module handles user authentication operations:

- Login with email and password
- User registration
- Logout
- Token refresh
- Password reset

```javascript
import { authService } from '../services';

// Login example
const handleLogin = async (email, password) => {
  try {
    const userData = await authService.login(email, password);
    // Handle successful login
  } catch (error) {
    // Handle login error
  }
};

// Check if user is authenticated
const isAuthenticated = authService.isAuthenticated();
```

## User Service

The `userService.js` module handles user profile operations:

- Get user profile
- Update user profile
- Upload profile photo
- Manage academic calendar
- Generate profile PDF

```javascript
import { userService } from '../services';

// Get user profile
const getUserProfile = async () => {
  try {
    const profile = await userService.getProfile();
    // Use profile data
  } catch (error) {
    // Handle error
  }
};

// Update profile
const updateProfile = async (profileData) => {
  try {
    const updatedProfile = await userService.updateProfile(profileData);
    // Handle successful update
  } catch (error) {
    // Handle error
  }
};
```

## Course Service

The `courseService.js` module handles course operations:

- Get all courses
- Get course details
- Create, update, and delete courses
- Manage course students
- Upload student lists
- Manage course schedules
- Get course statistics

```javascript
import { courseService } from '../services';

// Get all courses
const getCourses = async () => {
  try {
    const courses = await courseService.getCourses();
    // Use courses data
  } catch (error) {
    // Handle error
  }
};

// Create a new course
const createCourse = async (courseData) => {
  try {
    const newCourse = await courseService.createCourse(courseData);
    // Handle successful creation
  } catch (error) {
    // Handle error
  }
};
```

## Attendance Service

The `attendanceService.js` module handles attendance operations:

- Start and end attendance sessions
- Get active sessions
- Update attendance records
- Generate QR codes
- Export attendance data
- Get attendance statistics

```javascript
import { attendanceService } from '../services';

// Start attendance session
const startSession = async (courseId, sessionData) => {
  try {
    const session = await attendanceService.startSession(courseId, sessionData);
    // Handle successful session start
  } catch (error) {
    // Handle error
  }
};

// Mark student attendance
const markAttendance = async (courseId, sessionId, studentId, status) => {
  try {
    await attendanceService.markAttendance(courseId, sessionId, studentId, status);
    // Handle successful update
  } catch (error) {
    // Handle error
  }
};
```

## Usage with React Components

```javascript
import React, { useState, useEffect } from 'react';
import { courseService } from '../services';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourses();
        setCourses(data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch courses');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Render component
};
```