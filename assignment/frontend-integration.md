# Frontend Integration Guide

## Overview

The provided frontend application is built with Next.js and React. It currently uses mock data and localStorage for state management. Your task is to replace these with real API calls to your backend.

## Current Frontend Architecture

### Key Files to Understand

1. **Authentication Pages**
   - \`app/login/page.tsx\` - Login and registration forms
   - Uses localStorage to simulate authentication

2. **Survey Management**
   - \`app/surveys/page.tsx\` - Survey listing page
   - \`app/surveys/create/page.tsx\` - Survey creation form
   - \`app/surveys/editor/page.tsx\` - Survey editor with drag-and-drop
   - Uses localStorage to store surveys

3. **Respondent Management**
   - \`app/respondents/page.tsx\` - Respondent listing and analytics
   - Uses mock data for respondents

4. **Components**
   - \`components/question-editor.tsx\` - Question editing interface
   - \`components/question-bank.tsx\` - Pre-built questions library
   - \`components/survey-preview.tsx\` - Survey preview component

## Integration Points

### 1. Authentication Integration

#### Current Implementation (app/login/page.tsx)
\`\`\`typescript
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Simulate login process
  setTimeout(() => {
    setIsLoading(false)
    router.push("/")
  }, 1500)
}
\`\`\`

#### Required Changes
Replace the mock login with actual API calls:

\`\`\`typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      router.push("/")
    } else {
      setError(data.message)
    }
  } catch (error) {
    setError('Login failed. Please try again.')
  } finally {
    setIsLoading(false)
  }
}
\`\`\`

### 2. Survey Management Integration

#### Current Implementation (app/surveys/page.tsx)
\`\`\`typescript
// Mock data for surveys
const [allSurveys, setAllSurveys] = useState([
  {
    id: "1",
    title: "Product Satisfaction Survey",
    // ... mock data
  }
])
\`\`\`

#### Required Changes
Replace with API calls:

\`\`\`typescript
const [allSurveys, setAllSurveys] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchSurveys()
}, [])

const fetchSurveys = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/surveys', {
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    })

    const data = await response.json()
    if (data.success) {
      setAllSurveys(data.data.surveys)
    }
  } catch (error) {
    console.error('Failed to fetch surveys:', error)
  } finally {
    setLoading(false)
  }
}
\`\`\`

### 3. Survey Creation Integration

#### Current Implementation (app/surveys/editor/page.tsx)
\`\`\`typescript
const handlePublish = () => {
  // Save the survey to localStorage
  const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
  const newSurvey = {
    id: \`survey-\${Date.now()}\`,
    title: surveyTitle,
    description: surveyDescription,
    questions,
    status: "active",
    // ... other fields
  }

  surveys.push(newSurvey)
  localStorage.setItem("surveys", JSON.stringify(surveys))
}
\`\`\`

#### Required Changes
Replace with API calls:

\`\`\`typescript
const handlePublish = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify({
        title: surveyTitle,
        description: surveyDescription,
        questions
      })
    })

    const data = await response.json()
    if (data.success) {
      // Publish the survey
      await fetch(\`/api/surveys/\${data.data.survey.id}/publish\`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      })

      toast({
        title: "Survey Published!",
        description: "Your survey is now live and collecting responses."
      })
      router.push("/surveys")
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to publish survey. Please try again.",
      variant: "destructive"
    })
  }
}
\`\`\`

### 4. Respondent Management Integration

#### Current Implementation (app/respondents/page.tsx)
\`\`\`typescript
// Mock data for respondents
const respondents = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    // ... mock data
  }
]
\`\`\`

#### Required Changes
Replace with API calls:

\`\`\`typescript
const [respondents, setRespondents] = useState([])

useEffect(() => {
  fetchRespondents()
}, [])

const fetchRespondents = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/respondents', {
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    })

    const data = await response.json()
    if (data.success) {
      setRespondents(data.data.respondents)
    }
  } catch (error) {
    console.error('Failed to fetch respondents:', error)
  }
}
\`\`\`

## API Client Setup

### Create API Utility Functions

Create a new file \`lib/api.ts\`:

\`\`\`typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': \`Bearer \${token}\` })
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = \`\${API_BASE_URL}\${endpoint}\`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    })
  }

  // Surveys
  async getSurveys(params?: { status?: string; page?: number; limit?: number }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(\`/surveys\${queryString}\`)
  }

  async createSurvey(survey: { title: string; description: string; questions: any[] }) {
    return this.request('/surveys', {
      method: 'POST',
      body: JSON.stringify(survey)
    })
  }

  async getSurvey(id: string) {
    return this.request(\`/surveys/\${id}\`)
  }

  async updateSurvey(id: string, survey: any) {
    return this.request(\`/surveys/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(survey)
    })
  }

  async deleteSurvey(id: string) {
    return this.request(\`/surveys/\${id}\`, {
      method: 'DELETE'
    })
  }

  async publishSurvey(id: string) {
    return this.request(\`/surveys/\${id}/publish\`, {
      method: 'POST'
    })
  }

  // Survey Responses
  async getSurveyResponses(surveyId: string, params?: { page?: number; limit?: number }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(\`/surveys/\${surveyId}/responses\${queryString}\`)
  }

  async submitSurveyResponse(surveyId: string, response: any) {
    return this.request(\`/surveys/\${surveyId}/responses\`, {
      method: 'POST',
      body: JSON.stringify(response)
    })
  }

  // Respondents
  async getRespondents(params?: { page?: number; limit?: number; search?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(\`/respondents\${queryString}\`)
  }

  async getRespondent(id: string) {
    return this.request(\`/respondents/\${id}\`)
  }
}

export const apiClient = new ApiClient()
\`\`\`

## Environment Configuration

### Frontend Environment Variables

Create \`.env.local\` in the frontend project:

\`\`\`env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
\`\`\`

For development:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
\`\`\`

## Error Handling

### Global Error Handler

Create \`lib/error-handler.ts\`:

\`\`\`typescript
import { toast } from "@/hooks/use-toast"

export const handleApiError = (error: any) => {
  console.error('API Error:', error)
  
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return
  }

  toast({
    title: "Error",
    description: error.message || "Something went wrong. Please try again.",
    variant: "destructive"
  })
}
\`\`\`

## Authentication State Management

### Create Auth Context

Create \`contexts/auth-context.tsx\`:

\`\`\`typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password)
    
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    setUser(response.data.user)
  }

  const register = async (email: string, password: string, name: string) => {
    const response = await apiClient.register(email, password, name)
    
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    setUser(response.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
\`\`\`

## Testing Integration

### Test API Integration

Create test files to verify API integration:

\`\`\`typescript
// __tests__/api-integration.test.ts
import { apiClient } from '@/lib/api'

describe('API Integration', () => {
  test('should login with valid credentials', async () => {
    const response = await apiClient.login('test@example.com', 'password123')
    expect(response.success).toBe(true)
    expect(response.data.token).toBeDefined()
  })

  test('should fetch surveys', async () => {
    // Assuming user is logged in
    const response = await apiClient.getSurveys()
    expect(response.success).toBe(true)
    expect(Array.isArray(response.data.surveys)).toBe(true)
  })
})
\`\`\`

## Deployment Considerations

### CORS Configuration
Ensure your backend allows requests from your frontend domain:

\`\`\`javascript
// Example for Express.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}))
\`\`\`

### Environment Variables
Set production environment variables:
- \`NEXT_PUBLIC_API_URL\` should point to your production API
- Ensure HTTPS is used in production

This integration guide will help you connect the frontend application with your backend API seamlessly.
