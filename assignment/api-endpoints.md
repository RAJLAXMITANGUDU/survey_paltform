# API Endpoints Specification

## Base URL
Your API should be hosted and accessible at a public URL, for example:
\`https://your-api-domain.com/api/v1\`
This document is just for reference. Do not stick to it.

## Authentication

### POST /auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2023-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Error Response (400 Bad Request):**
\`\`\`json
{
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": ["This email is already registered"]
  }
}
\`\`\`

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

### GET /auth/me
Get current user information (requires authentication).

**Headers:**
\`Authorization: Bearer <token>\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2023-01-15T10:30:00Z"
    }
  }
}
\`\`\`

## Survey Management

### GET /surveys
Get list of surveys for the authenticated user.

**Headers:**
\`Authorization: Bearer <token>\`

**Query Parameters:**
- \`status\` (optional): Filter by status ("draft", "active", "completed")
- \`page\` (optional): Page number for pagination (default: 1)
- \`limit\` (optional): Items per page (default: 10)
- \`search\` (optional): Search in title and description

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "surveys": [
      {
        "id": "survey_456",
        "title": "Customer Satisfaction Survey",
        "description": "Help us improve our products and services",
        "status": "active",
        "questions_count": 5,
        "responses_count": 42,
        "created_at": "2023-01-15T10:30:00Z",
        "updated_at": "2023-01-15T11:00:00Z",
        "published_at": "2023-01-15T11:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 25,
      "items_per_page": 10
    }
  }
}
\`\`\`

### POST /surveys
Create a new survey.

**Headers:**
\`Authorization: Bearer <token>\`

**Request Body:**
\`\`\`json
{
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
}
\`\`\`

**Response (201 Created):**
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

### GET /surveys/:id
Get a specific survey by ID.

**Headers:**
\`Authorization: Bearer <token>\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "survey": {
      "id": "survey_456",
      "title": "Customer Satisfaction Survey",
      "description": "Help us improve our products and services",
      "status": "active",
      "questions": [
        {
          "id": "q1",
          "type": "single-choice",
          "question": "How satisfied are you with our service?",
          "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
          "required": true
        }
      ],
      "responses_count": 42,
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-01-15T11:00:00Z",
      "published_at": "2023-01-15T11:00:00Z"
    }
  }
}
\`\`\`

### PUT /surveys/:id
Update a survey.

**Headers:**
\`Authorization: Bearer <token>\`

**Request Body:**
\`\`\`json
{
  "title": "Updated Survey Title",
  "description": "Updated description",
  "questions": [...]
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Survey updated successfully",
  "data": {
    "survey": {
      "id": "survey_456",
      "title": "Updated Survey Title",
      "description": "Updated description",
      "status": "draft",
      "questions": [...],
      "updated_at": "2023-01-15T12:00:00Z"
    }
  }
}
\`\`\`

### DELETE /surveys/:id
Delete a survey.

**Headers:**
\`Authorization: Bearer <token>\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Survey deleted successfully"
}
\`\`\`

### POST /surveys/:id/publish
Publish a survey (change status from draft to active).

**Headers:**
\`Authorization: Bearer <token>\`

**Response (200 OK):**
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

## Survey Responses

### GET /surveys/:id/public
Get public survey for response submission (no authentication required).

**Response (200 OK):**
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

### POST /surveys/:id/responses
Submit a survey response (no authentication required).

**Request Body:**
\`\`\`json
{
  "respondent": {
    "email": "customer@example.com",
    "name": "Jane Smith"
  },
  "answers": {
    "q1": "Very Satisfied",
    "q2": "Great service, keep it up!"
  }
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "success": true,
  "message": "Response submitted successfully",
  "data": {
    "response_id": "response_101"
  }
}
\`\`\`

### GET /surveys/:id/responses
Get all responses for a survey (requires authentication and ownership).

**Headers:**
\`Authorization: Bearer <token>\`

**Query Parameters:**
- \`page\` (optional): Page number for pagination
- \`limit\` (optional): Items per page

**Response (200 OK):**
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
      "total_pages": 5,
      "total_items": 42,
      "items_per_page": 10
    }
  }
}
\`\`\`

## Respondent Management

### GET /respondents
Get list of all respondents for the authenticated user.

**Headers:**
\`Authorization: Bearer <token>\`

**Query Parameters:**
- \`page\` (optional): Page number for pagination
- \`limit\` (optional): Items per page
- \`search\` (optional): Search in name and email

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "respondents": [
      {
        "id": "respondent_789",
        "email": "customer@example.com",
        "name": "Jane Smith",
        "surveys_completed": 3,
        "last_response_at": "2023-01-16T09:20:00Z",
        "created_at": "2023-01-10T14:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 15,
      "items_per_page": 10
    }
  }
}
\`\`\`

### GET /respondents/:id
Get detailed information about a specific respondent.

**Headers:**
\`Authorization: Bearer <token>\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "respondent": {
      "id": "respondent_789",
      "email": "customer@example.com",
      "name": "Jane Smith",
      "metadata": {
        "location": "United States",
        "source": "website"
      },
      "surveys_completed": 3,
      "responses": [
        {
          "id": "response_101",
          "survey_id": "survey_456",
          "survey_title": "Customer Satisfaction Survey",
          "completed_at": "2023-01-16T09:20:00Z"
        }
      ],
      "created_at": "2023-01-10T14:30:00Z"
    }
  }
}
\`\`\`

## Error Handling

All endpoints should return consistent error responses:

### 400 Bad Request
\`\`\`json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": ["Title is required"],
    "email": ["Invalid email format"]
  }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "success": false,
  "message": "Authentication required"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "success": false,
  "message": "Access denied"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "success": false,
  "message": "Survey not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "success": false,
  "message": "Internal server error"
}
\`\`\`

## Rate Limiting

Consider implementing rate limiting for public endpoints:
- Survey response submission: 10 requests per minute per IP
- Authentication endpoints: 5 requests per minute per IP

## CORS Configuration

Ensure your API allows requests from the frontend domain and includes proper CORS headers:
- \`Access-Control-Allow-Origin\`
- \`Access-Control-Allow-Methods\`
- \`Access-Control-Allow-Headers\`
