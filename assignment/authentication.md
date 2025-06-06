# Authentication Implementation Guide

## Overview

The survey platform requires a secure authentication system to protect user data and ensure only authorized users can access their surveys and responses.

## Authentication Flow

### 1. User Registration
- Users register with email, password, and name
- Passwords must be hashed using a secure algorithm (bcrypt, Argon2, etc.)
- Email addresses must be unique
- Return JWT token upon successful registration

### 2. User Login
- Users authenticate with email and password
- Verify hashed password
- Return JWT token upon successful authentication
- Include user information in response

### 3. Token-Based Authentication
- Use JWT (JSON Web Tokens) for stateless authentication
- Include user ID and other necessary claims in token payload
- Set appropriate token expiration time (recommended: 24 hours)

## JWT Implementation

### Token Structure
\`\`\`json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "user_123",
    "email": "user@example.com",
    "iat": 1642234567,
    "exp": 1642320967
  },
  "signature": "..."
}
\`\`\`

### Token Claims
- \`user_id\`: Unique user identifier
- \`email\`: User's email address
- \`iat\`: Issued at timestamp
- \`exp\`: Expiration timestamp

### Secret Key Management
- Use a strong, randomly generated secret key
- Store secret key in environment variables
- Never commit secret keys to version control
- Consider key rotation for production systems

## Password Security

### Hashing Requirements
- Use bcrypt with minimum 12 rounds (or Argon2)
- Never store plain text passwords
- Salt passwords automatically (bcrypt handles this)

### Password Validation
Implement client-side and server-side validation:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Example Implementation (Node.js)
\`\`\`javascript
const bcrypt = require('bcrypt');

// Hash password during registration
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password during login
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
\`\`\`

## Protected Routes
This is just for reference. Do not stick to it.

### Middleware Implementation
Create authentication middleware to protect routes:

\`\`\`javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};
\`\`\`

### Route Protection
Apply middleware to protected routes:
- All survey management endpoints
- User profile endpoints
- Survey response viewing endpoints

### Public Routes
These routes should NOT require authentication:
- User registration
- User login
- Public survey viewing
- Survey response submission

## Frontend Integration

### Token Storage
The frontend stores JWT tokens in localStorage and includes them in API requests:

\`\`\`javascript
// Store token after login
localStorage.setItem('token', response.data.token);

// Include token in API requests
const token = localStorage.getItem('token');
const config = {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
};
\`\`\`

### Automatic Token Handling
The frontend automatically:
- Includes tokens in authenticated requests
- Redirects to login on 401 responses
- Clears tokens on logout

## Security Best Practices

### Input Validation
- Validate all input data
- Sanitize user inputs
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on authentication endpoints

### HTTPS Requirements
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Set secure cookie flags

### Error Handling
- Don't reveal sensitive information in error messages
- Use generic error messages for authentication failures
- Log security events for monitoring

### Session Management
- Implement token refresh mechanism for long-lived sessions
- Allow users to logout and invalidate tokens
- Consider implementing token blacklisting

## Environment Variables

Required environment variables:

\`\`\`env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Database Configuration
DATABASE_URL=your-database-connection-string

# Security
BCRYPT_ROUNDS=12
\`\`\`

## Testing Authentication

### Test Cases
1. **Registration Tests**
   - Valid registration data
   - Duplicate email handling
   - Invalid email format
   - Weak password rejection

2. **Login Tests**
   - Valid credentials
   - Invalid email
   - Invalid password
   - Non-existent user

3. **Protected Route Tests**
   - Valid token access
   - Invalid token rejection
   - Expired token handling
   - Missing token rejection

### Example Test (Jest)
\`\`\`javascript
describe('Authentication', () => {
  test('should register user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  test('should reject duplicate email', async () => {
    // First registration
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      });

    // Duplicate registration
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'AnotherPass123!',
        name: 'Another User'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
\`\`\`

## Common Implementation Pitfalls

### Avoid These Mistakes
1. **Storing passwords in plain text**
2. **Using weak JWT secrets**
3. **Not validating tokens properly**
4. **Exposing sensitive data in error messages**
5. **Not implementing proper CORS**
6. **Forgetting to hash passwords**
7. **Not setting token expiration**

### Security Checklist
- [ ] Passwords are hashed with bcrypt/Argon2
- [ ] JWT secret is strong and stored securely
- [ ] Tokens have appropriate expiration times
- [ ] Protected routes require valid authentication
- [ ] Input validation is implemented
- [ ] HTTPS is enforced in production
- [ ] Rate limiting is implemented
- [ ] Error messages don't leak sensitive information

This authentication system will provide a secure foundation for your survey platform while integrating seamlessly with the provided frontend application.
