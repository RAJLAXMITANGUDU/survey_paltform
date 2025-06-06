# Bonus: Analytics Implementation

## Overview

This bonus section covers implementing analytics features for the survey platform. Analytics provide valuable insights into survey performance, response patterns, and user engagement.

## Analytics Requirements

### 1. Survey Analytics
Track and analyze survey performance metrics:

- **Response Rate**: Total responses vs. survey views
- **Completion Rate**: Completed responses vs. started responses
- **Average Response Time**: Time taken to complete surveys
- **Drop-off Points**: Where users abandon surveys
- **Response Trends**: Responses over time

### 2. Question Analytics
Analyze individual question performance:

- **Response Distribution**: How answers are distributed
- **Skip Rate**: How often optional questions are skipped
- **Time per Question**: Average time spent on each question
- **Popular Choices**: Most selected options for choice questions

### 3. Respondent Analytics
Understand respondent behavior:

- **Demographics**: Age, location, device type
- **Engagement**: Repeat respondents, survey completion history
- **Response Quality**: Length of text responses, rating patterns
- **Source Tracking**: How respondents found the survey

## Database Schema Extensions

### Analytics Tables

#### Survey Views
Track when surveys are viewed:

\`\`\`sql
CREATE TABLE survey_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255)
);
\`\`\`

#### Response Sessions
Track survey completion sessions:

\`\`\`sql
CREATE TABLE response_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    abandoned_at TIMESTAMP,
    current_question_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(50)
);
\`\`\`

#### Question Analytics
Track question-level metrics:

\`\`\`sql
CREATE TABLE question_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
    time_spent INTEGER, -- seconds
    skipped BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## API Endpoints for Analytics

### Survey Analytics
This is just for reference. Do not stick to it.

#### GET /surveys/:id/analytics
Get comprehensive analytics for a survey:

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "survey_id": "survey_456",
    "overview": {
      "total_views": 1250,
      "total_responses": 342,
      "completion_rate": 68.5,
      "average_response_time": 180,
      "response_rate": 27.4
    },
    "trends": {
      "daily_responses": [
        { "date": "2023-01-15", "responses": 45, "views": 120 },
        { "date": "2023-01-16", "responses": 52, "views": 135 }
      ]
    },
    "demographics": {
      "devices": {
        "desktop": 45,
        "mobile": 40,
        "tablet": 15
      },
      "browsers": {
        "chrome": 60,
        "safari": 25,
        "firefox": 10,
        "other": 5
      }
    },
    "drop_off_analysis": [
      { "question_id": "q1", "completion_rate": 95 },
      { "question_id": "q2", "completion_rate": 87 },
      { "question_id": "q3", "completion_rate": 72 }
    ]
  }
}
\`\`\`

#### GET /surveys/:id/analytics/responses
Get response analytics over time:

**Query Parameters:**
- `period`: "day", "week", "month"
- `start_date`: Start date for analysis
- `end_date`: End date for analysis

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "period": "day",
    "data_points": [
      {
        "date": "2023-01-15",
        "responses": 45,
        "views": 120,
        "completion_rate": 68.2,
        "average_time": 175
      }
    ],
    "totals": {
      "total_responses": 342,
      "total_views": 1250,
      "overall_completion_rate": 68.5
    }
  }
}
\`\`\`

### Question Analytics

#### GET /surveys/:id/questions/:questionId/analytics
Get analytics for a specific question:

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "question_id": "q1",
    "question_text": "How satisfied are you with our service?",
    "question_type": "single-choice",
    "analytics": {
      "total_responses": 342,
      "skip_rate": 5.2,
      "average_time": 8.5,
      "response_distribution": {
        "Very Satisfied": 45,
        "Satisfied": 32,
        "Neutral": 15,
        "Dissatisfied": 6,
        "Very Dissatisfied": 2
      }
    }
  }
}
\`\`\`

### Dashboard Analytics

#### GET /analytics/dashboard
Get overview analytics for user's account:

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "overview": {
      "total_surveys": 12,
      "total_responses": 1456,
      "active_surveys": 8,
      "average_completion_rate": 72.3
    },
    "recent_activity": [
      {
        "survey_id": "survey_456",
        "survey_title": "Customer Satisfaction",
        "recent_responses": 23,
        "trend": "up"
      }
    ],
    "top_performing_surveys": [
      {
        "survey_id": "survey_789",
        "title": "Product Feedback",
        "completion_rate": 89.2,
        "total_responses": 234
      }
    ]
  }
}
\`\`\`

## Implementation Examples

### Response Rate Calculation

\`\`\`javascript
// Calculate response rate for a survey
const calculateResponseRate = async (surveyId) => {
  const views = await db.query(`
    SELECT COUNT(*) as total_views 
    FROM survey_views 
    WHERE survey_id = $1
  `, [surveyId]);

  const responses = await db.query(`
    SELECT COUNT(*) as total_responses 
    FROM survey_responses 
    WHERE survey_id = $1
  `, [surveyId]);

  const responseRate = (responses.rows[0].total_responses / views.rows[0].total_views) * 100;
  
  return {
    total_views: parseInt(views.rows[0].total_views),
    total_responses: parseInt(responses.rows[0].total_responses),
    response_rate: Math.round(responseRate * 10) / 10
  };
};
\`\`\`

### Completion Rate Analysis

\`\`\`javascript
// Calculate completion rate and drop-off points
const analyzeCompletionRate = async (surveyId) => {
  const survey = await db.query(`
    SELECT questions FROM surveys WHERE id = $1
  `, [surveyId]);

  const questions = survey.rows[0].questions;
  const dropOffAnalysis = [];

  for (let i = 0; i < questions.length; i++) {
    const questionId = questions[i].id;
    
    const totalStarted = await db.query(`
      SELECT COUNT(*) as count 
      FROM response_sessions 
      WHERE survey_id = $1
    `, [surveyId]);

    const completedThisQuestion = await db.query(`
      SELECT COUNT(*) as count 
      FROM survey_responses sr
      WHERE sr.survey_id = $1 
      AND sr.answers ? $2
    `, [surveyId, questionId]);

    const completionRate = (completedThisQuestion.rows[0].count / totalStarted.rows[0].count) * 100;

    dropOffAnalysis.push({
      question_id: questionId,
      question_text: questions[i].question,
      completion_rate: Math.round(completionRate * 10) / 10
    });
  }

  return dropOffAnalysis;
};
\`\`\`

### Response Time Tracking

\`\`\`javascript
// Track response time for analytics
const trackResponseTime = async (sessionId, questionId, timeSpent) => {
  await db.query(`
    INSERT INTO question_analytics (survey_id, question_id, response_id, time_spent)
    SELECT rs.survey_id, $2, sr.id, $3
    FROM response_sessions rs
    LEFT JOIN survey_responses sr ON sr.survey_id = rs.survey_id
    WHERE rs.session_id = $1
  `, [sessionId, questionId, timeSpent]);
};
\`\`\`

## Frontend Analytics Integration

### Analytics Dashboard Component

\`\`\`typescript
// components/analytics-dashboard.tsx
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, LineChart, PieChart } from 'recharts'

interface AnalyticsDashboardProps {
  surveyId: string
}

export default function AnalyticsDashboard({ surveyId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [surveyId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/surveys/${surveyId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setAnalytics(data.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading analytics...</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Response Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Views:</span>
              <span className="font-medium">{analytics.overview.total_views}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Responses:</span>
              <span className="font-medium">{analytics.overview.total_responses}</span>
            </div>
            <div className="flex justify-between">
              <span>Response Rate:</span>
              <span className="font-medium">{analytics.overview.response_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Completion Rate:</span>
              <span className="font-medium">{analytics.overview.completion_rate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            width={300}
            height={200}
            data={analytics.trends.daily_responses}
          >
            {/* Chart configuration */}
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart
            width={300}
            height={200}
            data={Object.entries(analytics.demographics.devices).map(([device, count]) => ({
              name: device,
              value: count
            }))}
          >
            {/* Chart configuration */}
          </PieChart>
        </CardContent>
      </Card>
    </div>
  )
}
\`\`\`

## Real-time Analytics

### WebSocket Implementation

For real-time analytics updates:

\`\`\`javascript
// WebSocket server setup (Node.js with Socket.io)
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Join survey analytics room
io.on('connection', (socket) => {
  socket.on('join-survey-analytics', (surveyId) => {
    socket.join(`survey-${surveyId}-analytics`);
  });
});

// Emit analytics updates when new responses come in
const emitAnalyticsUpdate = async (surveyId) => {
  const analytics = await calculateSurveyAnalytics(surveyId);
  io.to(`survey-${surveyId}-analytics`).emit('analytics-update', analytics);
};
\`\`\`

### Frontend WebSocket Integration

\`\`\`typescript
// hooks/use-real-time-analytics.ts
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export const useRealTimeAnalytics = (surveyId: string) => {
  const [analytics, setAnalytics] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL)
    setSocket(newSocket)

    newSocket.emit('join-survey-analytics', surveyId)

    newSocket.on('analytics-update', (data) => {
      setAnalytics(data)
    })

    return () => {
      newSocket.close()
    }
  }, [surveyId])

  return analytics
}
\`\`\`

## Performance Considerations

### Database Optimization

1. **Indexing Strategy**:
\`\`\`sql
-- Indexes for analytics queries
CREATE INDEX idx_survey_views_survey_id_date ON survey_views(survey_id, viewed_at);
CREATE INDEX idx_survey_responses_survey_id_date ON survey_responses(survey_id, completed_at);
CREATE INDEX idx_response_sessions_survey_id ON response_sessions(survey_id);
\`\`\`

2. **Aggregation Tables**:
\`\`\`sql
-- Pre-calculated daily analytics
CREATE TABLE daily_survey_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views_count INTEGER DEFAULT 0,
    responses_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2),
    average_response_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(survey_id, date)
);
\`\`\`

3. **Caching Strategy**:
\`\`\`javascript
// Redis caching for frequently accessed analytics
const getAnalyticsWithCache = async (surveyId) => {
  const cacheKey = `analytics:${surveyId}`;
  
  // Try to get from cache first
  let analytics = await redis.get(cacheKey);
  
  if (!analytics) {
    // Calculate analytics if not in cache
    analytics = await calculateSurveyAnalytics(surveyId);
    
    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(analytics));
  } else {
    analytics = JSON.parse(analytics);
  }
  
  return analytics;
};
\`\`\`

## Testing Analytics

### Test Cases

1. **Analytics Calculation Tests**:
\`\`\`javascript
describe('Analytics Calculations', () => {
  test('should calculate response rate correctly', async () => {
    // Create test data
    await createSurveyViews(surveyId, 100);
    await createSurveyResponses(surveyId, 25);
    
    const analytics = await calculateResponseRate(surveyId);
    
    expect(analytics.response_rate).toBe(25.0);
  });

  test('should track completion rate by question', async () => {
    const analytics = await analyzeCompletionRate(surveyId);
    
    expect(analytics).toHaveLength(3); // 3 questions
    expect(analytics[0].completion_rate).toBeGreaterThan(0);
  });
});
\`\`\`

2. **Real-time Updates Tests**:
\`\`\`javascript
describe('Real-time Analytics', () => {
  test('should emit analytics update on new response', async () => {
    const socket = io.connect(socketURL);
    
    socket.emit('join-survey-analytics', surveyId);
    
    // Submit a new response
    await submitSurveyResponse(surveyId, responseData);
    
    // Wait for analytics update
    const analyticsUpdate = await new Promise((resolve) => {
      socket.on('analytics-update', resolve);
    });
    
    expect(analyticsUpdate.overview.total_responses).toBeGreaterThan(0);
  });
});
\`\`\`

This analytics implementation provides comprehensive insights into survey performance while maintaining good performance through caching and optimized database queries.
