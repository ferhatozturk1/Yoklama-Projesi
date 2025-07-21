# API Error Handling and Interceptors

This directory contains utilities for API error handling and interceptors. These utilities provide a robust way to handle API errors and validate API responses.

## API Client

The `apiClient.js` module provides a configured Axios instance with interceptors for:

- Authentication token handling
- Request and response logging
- Error handling
- Request retry
- Token refresh

```javascript
import apiClient, { apiRequest } from '../utils/apiClient';

// Make a request with the client
const response = await apiClient.get('/users');

// Make a request with automatic error handling
const data = await apiRequest({
  method: 'get',
  url: '/users'
}, {
  showErrorNotification: true,
  transformResponse: data => data.users
});
```

## API Error Handler

The `apiErrorHandler.js` module provides utilities for handling API errors:

- Error type detection
- User-friendly error messages
- Validation error extraction
- Error formatting

```javascript
import { 
  getUserFriendlyMessage, 
  getValidationErrors 
} from '../utils/apiErrorHandler';

try {
  // Make API request
} catch (error) {
  // Get user-friendly error message
  const message = getUserFriendlyMessage(error);
  
  // Extract validation errors
  const validationErrors = getValidationErrors(error);
}
```

## API Validator

The `apiValidator.js` module provides utilities for validating API responses:

- Schema validation
- Response schema creation
- Common response schemas

```javascript
import { validateResponse } from '../utils/apiValidator';

// Validate response against schema
const isValid = validateResponse(response, 'course.detail');
```

## API Cache

The `apiCache.js` module provides utilities for caching API responses:

- Response caching
- Cache invalidation
- Cache statistics

```javascript
import { 
  getCachedResponse, 
  setCachedResponse, 
  clearCache 
} from '../utils/apiCache';

// Get cached response
const cachedData = getCachedResponse(cacheKey);

// Clear cache
clearCache();
```

## Custom Hooks

### useApi

The `useApi` hook provides a convenient way to make API requests with error handling:

```javascript
import { useApi } from '../hooks';

const MyComponent = () => {
  const { 
    loading, 
    error, 
    data, 
    get, 
    post 
  } = useApi({
    showSuccessNotification: true,
    showErrorNotification: true
  });
  
  const fetchData = async () => {
    try {
      await get('/users');
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay error={error} />}
      {data && <DataDisplay data={data} />}
    </div>
  );
};
```

### useApiValidation

The `useApiValidation` hook provides utilities for handling API validation errors:

```javascript
import { useApiValidation } from '../hooks';

const MyForm = () => {
  const { 
    validationErrors, 
    extractErrors, 
    getFormikErrors 
  } = useApiValidation();
  
  const handleSubmit = async (values, formikHelpers) => {
    try {
      await api.post('/users', values);
    } catch (error) {
      // Extract validation errors
      extractErrors(error);
      
      // Set Formik errors
      formikHelpers.setErrors(getFormikErrors());
    }
  };
  
  return (
    <Formik onSubmit={handleSubmit}>
      {/* Form fields */}
    </Formik>
  );
};
```

## Error Handling Flow

1. API request is made using `apiClient` or `useApi` hook
2. If request fails, error is caught by response interceptor
3. Error is processed by `apiErrorHandler` to determine error type
4. If error is a 401 Unauthorized, token refresh is attempted
5. If token refresh fails, user is redirected to login page
6. If error is a network error, request retry is attempted
7. If all retries fail, error is passed to error handler
8. Error handler shows notification and updates state
9. Component renders error message or validation errors

## Token Refresh Flow

1. API request is made with expired token
2. Server returns 401 Unauthorized
3. Response interceptor catches 401 error
4. Token refresh is attempted using refresh token
5. If refresh succeeds, original request is retried with new token
6. If refresh fails, user is logged out and redirected to login page

## Request Retry Flow

1. API request fails with network error or server error
2. Response interceptor catches error
3. If retry count is less than maximum, request is retried after delay
4. Delay increases exponentially with each retry (exponential backoff)
5. If all retries fail, error is passed to error handler

## Caching Flow

1. API GET request is made
2. Request interceptor checks cache for matching request
3. If cached response exists and is not expired, it is returned immediately
4. If no cached response exists, request is made to server
5. Response interceptor caches successful response
6. Subsequent identical requests use cached response until it expires