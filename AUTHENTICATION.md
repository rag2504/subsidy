# Authentication System Documentation

## Overview

This web application implements a robust, role-based authentication system with two distinct authentication methods:

1. **OTP-based Authentication** - For producers (public users)
2. **Static Credentials** - For restricted roles (gov, auditor, bank)

## Authentication Flow

### Producer Authentication (OTP-based)

1. **Initial Access**: When a user visits the Producer tab, they see a welcome screen
2. **Email Entry**: User enters their email address
3. **OTP Request**: System sends a 6-digit OTP to the provided email
4. **OTP Verification**: User enters the OTP to complete authentication
5. **Dashboard Access**: Upon successful verification, user is redirected to the Producer Dashboard

### Restricted Role Authentication (Static Credentials)

The following roles use static credentials for secure, restricted access:

- **Government (Gov)**: `gov@subsidy.gov` / `gov-secure-2024`
- **Auditor**: `auditor@subsidy.gov` / `audit-secure-2024`
- **Bank**: `bank@subsidy.gov` / `bank-secure-2024`

## Security Features

### Producer Security
- **Email Verification**: All producers must verify their email via OTP
- **JWT Tokens**: Secure, time-limited tokens (7 days by default)
- **Role-based Access**: Producers can only access producer-specific features
- **Session Management**: Automatic token validation and cleanup

### Restricted Role Security
- **Static Credentials**: Pre-configured credentials for authorized personnel
- **Role Isolation**: Each role has access only to their specific dashboard
- **Secure Tokens**: JWT tokens with role-specific permissions
- **Access Control**: Server-side validation of all requests

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/request-otp
- Purpose: Request OTP for producer authentication
- Body: { email: string }
- Response: { ok: boolean, devOtp?: string }

POST /api/auth/verify-otp
- Purpose: Verify OTP and get JWT token
- Body: { email: string, otp: string, role: string }
- Response: { token: string }

POST /api/auth/static-login
- Purpose: Authenticate restricted roles with static credentials
- Body: { email: string, password: string, role: string }
- Response: { token: string }

GET /api/auth/me
- Purpose: Validate current token and get user info
- Headers: Authorization: Bearer <token>
- Response: { user: { sub: string, role: string } }
```

### Protected Endpoints

All role-specific endpoints require authentication and proper role authorization:

- **Producer**: `/api/producer/*`
- **Government**: `/api/gov/*`
- **Auditor**: `/api/auditor/*`
- **Bank**: `/api/bank/*`

## User Experience

### Producer Dashboard Features
- **Welcome Screen**: Clear introduction and authentication flow
- **Project Management**: Apply for new projects and track existing ones
- **Status Tracking**: Real-time updates on application status
- **Statistics**: Overview of total, active, and pending projects
- **Responsive Design**: Works on desktop and mobile devices

### Restricted Role Features
- **Secure Access**: Password-protected entry for authorized personnel
- **Role-specific Dashboards**: Tailored interfaces for each role
- **Clear Authorization**: Visual indicators of restricted access areas

## Implementation Details

### Frontend Components
- `AuthGate.tsx`: Main authentication component with role-specific flows
- `Producer.tsx`: Enhanced producer dashboard with project management
- `auth.ts`: Client-side token management utilities

### Backend Implementation
- `auth.ts`: Server-side authentication routes and validation
- `middleware/auth.ts`: JWT validation and role-based access control
- Static credential management with secure password storage

### Token Management
- **Storage**: LocalStorage for client-side persistence
- **Validation**: Automatic token validation on each request
- **Expiration**: Configurable token expiration (default: 7 days)
- **Cleanup**: Automatic token cleanup on expiration or logout

## Security Considerations

1. **HTTPS Required**: All authentication should be over HTTPS in production
2. **Environment Variables**: JWT secrets should be stored securely
3. **Rate Limiting**: OTP requests should be rate-limited to prevent abuse
4. **Input Validation**: All user inputs are validated server-side
5. **Token Security**: JWT tokens are signed and validated properly
6. **Role Isolation**: Strict role-based access control prevents privilege escalation

## Development Notes

### Testing Credentials
For development and testing purposes, the following credentials are available:

- **Producer**: Use any valid email address with OTP verification
- **Government**: `gov@subsidy.gov` / `gov-secure-2024`
- **Auditor**: `auditor@subsidy.gov` / `audit-secure-2024`
- **Bank**: `bank@subsidy.gov` / `bank-secure-2024`

### Environment Variables
```env
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=7d
```

## Future Enhancements

1. **Multi-factor Authentication**: Additional security layers for restricted roles
2. **Session Management**: Advanced session tracking and management
3. **Audit Logging**: Comprehensive authentication event logging
4. **Password Policies**: Enhanced password requirements for restricted roles
5. **Account Recovery**: Secure account recovery mechanisms for producers
