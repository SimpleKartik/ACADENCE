# Next.js Route Protection Middleware

## Overview

The middleware protects dashboard routes based on JWT authentication and user roles.

## Protected Routes

- `/dashboard/student/*` → **Student only**
- `/dashboard/teacher/*` → **Teacher only**
- `/dashboard/admin/*` → **Admin only**

## Authentication Flow

1. **Token Check**: Looks for JWT token in:
   - HTTP-only cookie: `acadence_token` (preferred)
   - Authorization header: `Bearer <token>` (fallback)

2. **Token Verification**: 
   - Verifies JWT signature using `jose` library
   - Checks token expiration
   - Extracts user role from payload

3. **Role Validation**:
   - Compares token role with required route role
   - Allows access if roles match
   - Redirects if roles don't match

## Behavior

### No Token
- **Action**: Redirect to `/select-role`
- **Query Params**: `redirect=<original-path>`

### Invalid/Expired Token
- **Action**: Redirect to `/select-role`
- **Query Params**: `redirect=<original-path>&expired=true`

### Role Mismatch
- **Action**: Redirect to `/unauthorized`
- **Query Params**: `required=<required-role>&actual=<user-role>`

### Valid Token & Correct Role
- **Action**: Allow access to route

## Configuration

### Environment Variables

Create `.env.local`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Must match backend `JWT_SECRET`

### Matcher Configuration

Middleware runs on all routes except:
- `/api/*` - API routes
- `/_next/*` - Next.js internal files
- Static files (images, fonts, etc.)

## Implementation Details

### Token Source Priority

1. **Cookie** (`acadence_token`) - Preferred for security
2. **Authorization Header** (`Bearer <token>`) - Fallback

### JWT Verification

Uses `jose` library (edge-compatible):
- Verifies signature
- Checks expiration
- Extracts payload safely

### Edge Runtime

Middleware runs on Edge Runtime:
- Fast execution
- Low latency
- Limited Node.js APIs

## Unauthorized Page

Located at `/app/unauthorized/page.tsx`

Displays:
- Error message
- Required role vs actual role
- Navigation options

## Usage Example

```typescript
// User with student role tries to access teacher dashboard
// Middleware intercepts request
// Verifies token
// Checks role mismatch
// Redirects to /unauthorized?required=teacher&actual=student
```

## Testing

1. **No Token Test**:
   - Visit `/dashboard/student`
   - Should redirect to `/select-role?redirect=/dashboard/student`

2. **Invalid Token Test**:
   - Set invalid token in cookie
   - Visit `/dashboard/student`
   - Should redirect to `/select-role?expired=true`

3. **Role Mismatch Test**:
   - Login as student
   - Visit `/dashboard/teacher`
   - Should redirect to `/unauthorized?required=teacher&actual=student`

4. **Valid Access Test**:
   - Login as student
   - Visit `/dashboard/student`
   - Should allow access

## Security Features

✅ JWT signature verification  
✅ Token expiration checking  
✅ Role-based access control  
✅ Secure token storage (HTTP-only cookies preferred)  
✅ Edge runtime for fast execution  
✅ No trust in frontend role claims  

## Future Enhancements

- Token refresh mechanism
- Rate limiting
- IP-based restrictions
- Audit logging
- Multi-factor authentication support
