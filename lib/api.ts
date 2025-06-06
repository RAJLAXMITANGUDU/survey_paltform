const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

 async getSurveys(params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const queryString = params
    ? "?" + new URLSearchParams(params as any).toString()
    : "";
  return this.request(`/surveys${queryString}`);
}

 
  async createSurvey(survey: { title: string; description: string; questions: any[] }) {
    return this.request('/surveys', {
      method: 'POST',
      body: JSON.stringify(survey),
    });
  }

  async getSurvey(id: string) {
    return this.request(`/surveys/${id}`);
  }

  async updateSurvey(id: string, survey: any) {
    return this.request(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(survey),
    });
  }

  async deleteSurvey(id: string) {
    return this.request(`/surveys/${id}`, {
      method: 'DELETE',
    });
  }

  async publishSurvey(id: string) {
    return this.request(`/surveys/${id}/publish`, {
      method: 'POST',
    });
  }

  // Survey Responses
  async getSurveyResponses(surveyId: string, params?: { page?: number; limit?: number }) {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/surveys/${surveyId}/responses${qs}`);
  }

  async submitSurveyResponse(surveyId: string, response: any) {
    return this.request(`/surveys/${surveyId}/responses`, {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }

  // Respondents
  async getRespondents(params?: { page?: number; limit?: number; search?: string }) {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/respondents${qs}`);
  }

  async getRespondent(id: string) {
    return this.request(`/respondents/${id}`);
  }
}

export const apiClient = new ApiClient();