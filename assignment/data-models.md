# Data Models and Database Schema
This is just for reference. Do not stick to it.

## Overview

This document outlines the required data models for the survey platform backend. You can implement these using any database technology (SQL or NoSQL).

## Core Entities

### 1. User
Represents registered users of the platform.

**Fields:**
- `id` - Unique identifier (Primary Key)
- `email` - User's email address (Unique, Required)
- `password` - Hashed password (Required)
- `name` - User's full name (Required)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp
- `is_active` - Boolean flag for account status

**Example JSON:**
\`\`\`json
{
  "id": "user_123",
  "email": "john@example.com",
  "name": "John Doe",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-15T10:30:00Z",
  "is_active": true
}
\`\`\`

### 2. Survey
Represents a survey created by a user.

**Fields:**
- `id` - Unique identifier (Primary Key)
- `user_id` - Foreign key to User (Required)
- `title` - Survey title (Required)
- `description` - Survey description (Optional)
- `status` - Survey status: "draft", "active", "completed" (Required)
- `questions` - JSON array of survey questions (Required)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `published_at` - Publication timestamp (Optional)

**Example JSON:**
\`\`\`json
{
  "id": "survey_456",
  "user_id": "user_123",
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
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-15T11:00:00Z",
  "published_at": "2023-01-15T11:00:00Z"
}
\`\`\`

### 3. Respondent
Represents someone who has responded to surveys.

**Fields:**
- `id` - Unique identifier (Primary Key)
- `email` - Respondent's email (Optional)
- `name` - Respondent's name (Optional)
- `metadata` - JSON object for additional data (Optional)
- `created_at` - First response timestamp
- `updated_at` - Last update timestamp

**Example JSON:**
\`\`\`json
{
  "id": "respondent_789",
  "email": "customer@example.com",
  "name": "Jane Smith",
  "metadata": {
    "location": "United States",
    "source": "website"
  },
  "created_at": "2023-01-16T09:15:00Z",
  "updated_at": "2023-01-16T09:15:00Z"
}
\`\`\`

### 4. Survey Response
Represents a completed survey response.

**Fields:**
- `id` - Unique identifier (Primary Key)
- `survey_id` - Foreign key to Survey (Required)
- `respondent_id` - Foreign key to Respondent (Required)
- `answers` - JSON object containing question answers (Required)
- `completed_at` - Response completion timestamp
- `ip_address` - Respondent's IP address (Optional)
- `user_agent` - Browser user agent (Optional)

**Example JSON:**
\`\`\`json
{
  "id": "response_101",
  "survey_id": "survey_456",
  "respondent_id": "respondent_789",
  "answers": {
    "q1": "Very Satisfied",
    "q2": "The product quality is excellent"
  },
  "completed_at": "2023-01-16T09:20:00Z",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
\`\`\`

## Question Types and Structure

The `questions` field in the Survey model should support various question types:

### Text Questions
\`\`\`json
{
  "id": "q1",
  "type": "short-text",
  "question": "What is your name?",
  "required": true
}
\`\`\`

### Choice Questions
\`\`\`json
{
  "id": "q2",
  "type": "single-choice",
  "question": "What is your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "required": true
}
\`\`\`

### Rating Questions
\`\`\`json
{
  "id": "q3",
  "type": "rating",
  "question": "Rate our service",
  "options": ["1", "2", "3", "4", "5"],
  "required": true
}
\`\`\`

### NPS Questions
\`\`\`json
{
  "id": "q4",
  "type": "nps",
  "question": "How likely are you to recommend us?",
  "options": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  "required": true
}
\`\`\`

## Relationships

### SQL Database Relationships
- User (1) → Survey (Many)
- Survey (1) → Survey Response (Many)
- Respondent (1) → Survey Response (Many)

### NoSQL Database Considerations
If using a NoSQL database like MongoDB:
- Embed questions directly in the Survey document
- Reference user_id and respondent_id in responses
- Consider denormalizing frequently accessed data

## Indexes and Performance

### Recommended Indexes
- User: `email` (unique)
- Survey: `user_id`, `status`, `created_at`
- Survey Response: `survey_id`, `respondent_id`, `completed_at`
- Respondent: `email`

### Query Optimization
- Index on survey status for filtering active/draft surveys
- Composite index on (survey_id, completed_at) for response analytics
- Consider pagination for large result sets

## Data Validation

### Survey Questions Validation
- Ensure question IDs are unique within a survey
- Validate question types against allowed types
- Ensure required fields are present for each question type

### Response Validation
- Validate answers against survey questions
- Ensure required questions are answered
- Validate answer format based on question type

## Migration Considerations

If using SQL databases, consider these migration scripts:

### Initial Schema
\`\`\`sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Surveys table
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    questions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Respondents table
CREATE TABLE respondents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255),
    name VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Survey responses table
CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    respondent_id UUID REFERENCES respondents(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);
\`\`\`

This schema provides a solid foundation for the survey platform while maintaining flexibility for future enhancements.
