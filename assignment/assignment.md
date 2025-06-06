# Survey Platform Backend Assignment

## Overview

You have been provided with a complete frontend React/Next.js application for a survey platform. Your task is to create a backend API that will power this frontend application. The frontend is already built and functional with mock data - you need to replace the mock data with real API calls to your backend.

## What You're Building

A survey platform backend that allows users to:
- Register and authenticate
- Create and manage surveys
- Collect and view survey responses
- Manage survey respondents

## Core Requirements

### 1. Authentication System
- User registration and login
- JWT-based authentication
- Password hashing and security
- Protected routes/endpoints

### 2. Survey Management
- Create new surveys
- List user's surveys
- Update survey details
- Delete surveys
- Publish/unpublish surveys

### 3. Survey Response Collection
- Submit survey responses
- Store response data
- Link responses to surveys and respondents

### 4. Respondent Management
- Track survey respondents
- Store respondent information
- View respondent profiles and history

## Technical Requirements

### Database
- Use any database of your choice (PostgreSQL, MySQL, MongoDB, etc.)
- Design appropriate schema/collections for the data models
- Implement proper relationships between entities

### API Framework
- Use any backend framework (Node.js/Express, Python/Django/FastAPI, Ruby on Rails, etc.)
- RESTful API design
- Proper HTTP status codes
- JSON request/response format

### Hosting
- Deploy your backend to any cloud platform (Heroku, Railway, Render, AWS, etc.)
- Provide a publicly accessible API URL
- Ensure CORS is properly configured for frontend integration

## Detailed Requirements

Please refer to the following files for specific implementation details:

- [Data Models](./data-models.md) - Database schema and relationships
- [API Endpoints](./api-endpoints.md) - Required API endpoints and specifications
- [Authentication](./authentication.md) - Authentication flow and security requirements
- [Frontend Integration](./frontend-integration.md) - How to integrate with the provided frontend
- [Testing Guide](./testing-guide.md) - How to test your implementation

## Deliverables

1. **Backend Code**: Complete source code with proper documentation
2. **Database Schema**: SQL/NoSQL schema files or migration scripts
3. **API Documentation**: Detailed API documentation (Postman collection, OpenAPI spec, or similar)
4. **Deployment**: Hosted backend with public API URL
5. **README**: Comprehensive setup and testing instructions
6. **Environment Setup**: Example environment variables and configuration

## Evaluation Criteria

- **Functionality**: All core features working correctly
- **Code Quality**: Clean, well-organized, and documented code
- **Database Design**: Proper schema design and relationships
- **API Design**: RESTful principles and proper error handling
- **Security**: Proper authentication and data validation
- **Documentation**: Clear setup instructions and API documentation
- **Deployment**: Successfully hosted and accessible

## Bonus Points

- **Analytics**: Implement basic analytics endpoints (survey completion rates, response trends)
- **Data Validation**: Comprehensive input validation and error handling
- **Performance**: Database indexing and query optimization
- **Testing**: Unit tests and integration tests
- **Advanced Features**: Real-time updates, email notifications, etc.

## Getting Started

1. Review the frontend code to understand the data structures and API calls
2. Choose your technology stack
3. Design your database schema
4. Implement the core API endpoints
5. Test with the frontend application
6. Deploy and document your solution

## Questions?

If you have any questions about the requirements or need clarification on any aspect of the assignment, please don't hesitate to ask.

Good luck!
