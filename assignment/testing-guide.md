# Testing Guide
This is just for reference. Do not stick to it.


## Overview

This guide provides comprehensive instructions for testing your survey platform backend implementation. Follow these steps to ensure your API works correctly with the provided frontend.

## Prerequisites

Before testing, ensure you have:
- Backend API deployed and accessible
- Database set up and running
- Frontend application configured with your API URL
- API testing tool (Postman, Insomnia, or curl)

## Testing Checklist

### ✅ Authentication Testing

#### 1. User Registration
**Test Case**: Register a new user

**Request:**
\`\`\`bash
curl -X POST https://your-api-url.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "email": "test@example.com",
      "name": "Test User",
      "created_at": "2023-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Validation Points:**
- [ ] Returns 201 status code
- [ ] Response includes user data and JWT token
- [ ] Password is not included in response
- [ ] Token is valid JWT format

#### 2. User Login
**Test Case**: Login with valid credentials

**Request:**
\`\`\`bash
curl -X POST https://your-api-url.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "test@example.com",
      "name": "Test User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Validation Points:**
- [ ] Returns 200 status code
- [ ] Token is different from registration token
- [ ] User data matches registered user

#### 3. Protected Route Access
**Test Case**: Access user profile with valid token

**Request:**
\`\`\`bash
curl -X GET https://your-api-url.com/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "test@example.com",
      "name": "Test User",
      "created_at": "2023-01-15T10:30:00Z"
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] Returns 200 status code with valid token
- [ ] Returns 401 status code without token
- [ ] Returns 401 status code with invalid token

### ✅ Survey Management Testing

#### 1. Create Survey
**Test Case**: Create a new survey

**Request:**
\`\`\`bash
curl -X POST https://your-api-url.com/api/v1/surveys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Customer Satisfaction Survey",
    "description": "Help us improve our products and services",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "question": "How satisfied are you with our service?",
        "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
        "required": true
      },
      {
        "id": "q2",
        "type": "long-text",
        "question": "What can we improve?",
        "required": false
      }
    ]
  }'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "message": "Survey created successfully",
  "data": {
    "survey": {
      "id": "survey_456",
      "title": "Customer Satisfaction Survey",
      "description": "Help us improve our products and services",
      "status": "draft",
      "questions": [...],
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-01-15T10:30:00Z"
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] Returns 201 status code
- [ ] Survey has unique ID
- [ ] Status defaults to "draft"
- [ ] Questions are stored correctly
- [ ] Survey is linked to authenticated user

#### 2. List Surveys
**Test Case**: Get user's surveys

**Request:**
\`\`\`bash
curl -X GET https://your-api-url.com/api/v1/surveys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "surveys": [
      {
        "id": "survey_456",
        "title": "Customer Satisfaction Survey",
        "description": "Help us improve our products and services",
        "status": "draft",
        "questions_count": 2,
        "responses_count": 0,
        "created_at": "2023-01-15T10:30:00Z",
        "updated_at": "2023-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 10
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] Returns only surveys belonging to authenticated user
- [ ] Includes pagination information
- [ ] Survey counts are accurate

#### 3. Publish Survey
**Test Case**: Publish a draft survey

**Request:**
\`\`\`bash
curl -X POST https://your-api-url.com/api/v1/surveys/survey_456/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "message": "Survey published successfully",
  "data": {
    "survey": {
      "id": "survey_456",
      "status": "active",
      "published_at": "2023-01-15T12:00:00Z"
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] Status changes from "draft" to "active"
- [ ] Published timestamp is set
- [ ] Survey becomes publicly accessible

### ✅ Survey Response Testing

#### 1. Get Public Survey
**Test Case**: Access published survey without authentication

**Request:**
\`\`\`bash
curl -X GET https://your-api-url.com/api/v1/surveys/survey_456/public
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "survey": {
      "id": "survey_456",
      "title": "Customer Satisfaction Survey",
      "description": "Help us improve our products and services",
      "questions": [
        {
          "id": "q1",
          "type": "single-choice",
          "question": "How satisfied are you with our service?",
          "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
          "required": true
        }
      ]
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] No authentication required
- [ ] Returns only published surveys
- [ ] Includes all necessary question data

#### 2. Submit Survey Response
**Test Case**: Submit a survey response

**Request:**
\`\`\`bash
curl -X POST https://your-api-url.com/api/v1/surveys/survey_456/responses \
  -H "Content-Type: application/json" \
  -d '{
    "respondent": {
      "email": "customer@example.com",
      "name": "Jane Smith"
    },
    "answers": {
      "q1": "Very Satisfied",
      "q2": "Great service, keep it up!"
    }
  }'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "message": "Response submitted successfully",
  "data": {
    "response_id": "response_101"
  }
}
\`\`\`

**Validation Points:**
- [ ] No authentication required
- [ ] Creates or updates respondent record
- [ ] Stores answers correctly
- [ ] Returns response ID

#### 3. Get Survey Responses
**Test Case**: Get responses for a survey (authenticated)

**Request:**
\`\`\`bash
curl -X GET https://your-api-url.com/api/v1/surveys/survey_456/responses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "responses": [
      {
        "id": "response_101",
        "respondent": {
          "id": "respondent_789",
          "email": "customer@example.com",
          "name": "Jane Smith"
        },
        "answers": {
          "q1": "Very Satisfied",
          "q2": "Great service, keep it up!"
        },
        "completed_at": "2023-01-16T09:20:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 10
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] Requires authentication
- [ ] Only returns responses for user's surveys
- [ ] Includes respondent information
- [ ] Answers match submitted data

### ✅ Respondent Management Testing

#### 1. List Respondents
**Test Case**: Get all respondents for user's surveys

**Request:**
\`\`\`bash
curl -X GET https://your-api-url.com/api/v1/respondents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "respondents": [
      {
        "id": "respondent_789",
        "email": "customer@example.com",
        "name": "Jane Smith",
        "surveys_completed": 1,
        "last_response_at": "2023-01-16T09:20:00Z",
        "created_at": "2023-01-16T09:20:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 10
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] Requires authentication
- [ ] Only shows respondents from user's surveys
- [ ] Includes response statistics
- [ ] Supports pagination

#### 2. Get Respondent Details
**Test Case**: Get detailed respondent information

**Request:**
\`\`\`bash
curl -X GET https://your-api-url.com/api/v1/respondents/respondent_789 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "respondent": {
      "id": "respondent_789",
      "email": "customer@example.com",
      "name": "Jane Smith",
      "metadata": {},
      "surveys_completed": 1,
      "responses": [
        {
          "id": "response_101",
          "survey_id": "survey_456",
          "survey_title": "Customer Satisfaction Survey",
          "completed_at": "2023-01-16T09:20:00Z"
        }
      ],
      "created_at": "2023-01-16T09:20:00Z"
    }
  }
}
\`\`\`

**Validation Points:**
- [ ] Includes complete response history
- [ ] Shows survey titles for context
- [ ] Respects user ownership (can't access other users' respondents)

## Error Testing

### Test Error Scenarios

#### 1. Invalid Authentication
\`\`\`bash
# Test with invalid token
curl -X GET https://your-api-url.com/api/v1/surveys \
  -H "Authorization: Bearer invalid_token"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": false,
  "message": "Invalid or expired token"
}
\`\`\`

#### 2. Validation Errors
\`\`\`bash
# Test with missing required fields
curl -X POST https://your-api-url.com/api/v1/surveys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Missing title"
  }'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": ["Title is required"],
    "questions": ["Questions are required"]
  }
}
\`\`\`

#### 3. Resource Not Found
\`\`\`bash
# Test with non-existent survey ID
curl -X GET https://your-api-url.com/api/v1/surveys/nonexistent_id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": false,
  "message": "Survey not found"
}
\`\`\`

## Frontend Integration Testing

### 1. Login Flow Test
1. Open the frontend application
2. Navigate to `/login`
3. Enter valid credentials and submit
4. Verify redirect to dashboard
5. Check that user data is displayed correctly
6. Verify token is stored in localStorage

### 2. Survey Creation Test
1. Login to the application
2. Navigate to `/surveys/create`
3. Fill in survey details and add questions
4. Click "Publish Survey"
5. Verify survey appears in survey list
6. Check survey status is "active"

### 3. Survey Response Test
1. Get a published survey's public URL
2. Open survey in incognito/private browser
3. Fill out and submit the survey
4. Login as survey owner
5. Navigate to survey responses
6. Verify the response appears correctly

## Performance Testing

### Load Testing
Test your API with multiple concurrent requests:

\`\`\`bash
# Install Apache Bench (ab) for load testing
# Test login endpoint
ab -n 100 -c 10 -p login_data.json -T application/json \
  https://your-api-url.com/api/v1/auth/login

# Test survey listing
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api-url.com/api/v1/surveys
\`\`\`

**Performance Benchmarks:**
- [ ] Login endpoint handles 100 concurrent requests
- [ ] Survey listing responds within 500ms
- [ ] Database queries are optimized
- [ ] API doesn't crash under load

## Security Testing

### 1. SQL Injection Testing
Try malicious inputs in request bodies:

\`\`\`bash
curl -X POST https://your-api-url.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password'; DROP TABLE users; --"
  }'
\`\`\`

**Expected:** API should handle this safely without executing SQL

### 2. XSS Prevention Testing
Test with script tags in survey titles:

\`\`\`bash
curl -X POST https://your-api-url.com/api/v1/surveys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "<script>alert('xss')</script>",
    "description": "Test survey",
    "questions": []
  }'
\`\`\`

**Expected:** Script tags should be escaped or sanitized

### 3. Authorization Testing
Try accessing other users' data:

\`\`\`bash
# Create two users and try to access User A's surveys with User B's token
curl -X GET https://your-api-url.com/api/v1/surveys \
  -H "Authorization: Bearer USER_B_TOKEN"
\`\`\`

**Expected:** Should only return User B's surveys

## Database Testing

### 1. Data Integrity
- [ ] Foreign key constraints are enforced
- [ ] Required fields cannot be null
- [ ] Email uniqueness is enforced
- [ ] Cascade deletes work correctly

### 2. Query Performance
- [ ] Survey listing queries are indexed
- [ ] Response aggregation is efficient
- [ ] Large datasets don't cause timeouts

## Deployment Testing

### 1. Environment Variables
Verify all required environment variables are set:

\`\`\`bash
# Check if API responds with proper configuration
curl https://your-api-url.com/api/v1/health
\`\`\`

### 2. CORS Configuration
Test from frontend domain:

\`\`\`javascript
// Run in browser console from your frontend domain
fetch('https://your-api-url.com/api/v1/surveys', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(response => console.log('CORS working:', response.ok))
.catch(error => console.error('CORS error:', error))
\`\`\`

### 3. HTTPS Verification
- [ ] API is accessible via HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate is valid

## Automated Testing

### Create Test Suite
Set up automated tests for your API:

\`\`\`javascript
// Example test file (Jest/Mocha)
describe('Survey API', () => {
  let authToken;
  let surveyId;

  beforeAll(async () => {
    // Login and get token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.data.token;
  });

  test('should create survey', async () => {
    const response = await request(app)
      .post('/api/v1/surveys')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Survey',
        description: 'Test Description',
        questions: [
          {
            id: 'q1',
            type: 'single-choice',
            question: 'Test question?',
            options: ['Yes', 'No'],
            required: true
          }
        ]
      })
      .expect(201);

    surveyId = response.body.data.survey.id;
    expect(response.body.success).toBe(true);
  });

  test('should publish survey', async () => {
    const response = await request(app)
      .post(`/api/v1/surveys/${surveyId}/publish`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data.survey.status).toBe('active');
  });

  test('should submit response', async () => {
    const response = await request(app)
      .post(`/api/v1/surveys/${surveyId}/responses`)
      .send({
        respondent: {
          email: 'respondent@example.com',
          name: 'Test Respondent'
        },
        answers: {
          q1: 'Yes'
        }
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
\`\`\`

## Final Checklist

Before submitting your implementation, ensure:

### ✅ Core Functionality
- [ ] User registration and login work
- [ ] JWT authentication is implemented
- [ ] Users can create, edit, and delete surveys
- [ ] Surveys can be published and made public
- [ ] Survey responses can be submitted
- [ ] Survey owners can view responses
- [ ] Respondent management works

### ✅ Security
- [ ] Passwords are hashed
- [ ] JWT tokens are secure
- [ ] Input validation is implemented
- [ ] SQL injection protection
- [ ] Authorization checks prevent data leaks

### ✅ API Quality
- [ ] Consistent response format
- [ ] Proper HTTP status codes
- [ ] Error handling with meaningful messages
- [ ] Pagination for large datasets
- [ ] CORS configured correctly

### ✅ Database
- [ ] Schema is properly designed
- [ ] Relationships are correctly implemented
- [ ] Indexes are added for performance
- [ ] Data integrity constraints

### ✅ Documentation
- [ ] API endpoints are documented
- [ ] Setup instructions are clear
- [ ] Environment variables are documented
- [ ] Testing instructions provided

### ✅ Deployment
- [ ] Backend is hosted and accessible
- [ ] Database is set up and connected
- [ ] Environment variables configured
- [ ] HTTPS is enabled

## Troubleshooting Common Issues

### CORS Errors
If you see CORS errors in the browser:
1. Check your CORS configuration
2. Ensure your frontend domain is allowed
3. Verify preflight requests are handled

### Authentication Issues
If authentication isn't working:
1. Check JWT secret configuration
2. Verify token format and expiration
3. Ensure Authorization header format is correct

### Database Connection Issues
If database queries fail:
1. Check connection string
2. Verify database credentials
3. Ensure database is accessible from your hosting platform

### 404 Errors
If endpoints return 404:
1. Check route definitions
2. Verify API base URL configuration
3. Ensure proper HTTP methods are used

This comprehensive testing guide will help you verify that your backend implementation works correctly with the provided frontend and meets all the requirements of the assignment.
