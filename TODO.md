# TODO: E-commerce Authentication Backend and Frontend Enhancements

This document outlines tasks to enhance the scalability, security, performance, email functionality, logout functionality, and frontend user experience of the e-commerce platform's authentication system, to be implemented as the user base grows. These tasks are derived from a detailed review of the authentication flow using Next.js, Prisma with Accelerate, and Material-UI, with additional tasks for EmailJS management, template improvements, logout enhancements, and frontend optimizations. Each task includes a description, priority, estimated effort, and implementation notes.

## Table of Contents

1. [Cron Jobs for Token and Session Cleanup](#cron-jobs-for-token-and-session-cleanup)
2. [Rate-Limiting for Sensitive Endpoints](#rate-limiting-for-sensitive-endpoints)
3. [Asynchronous Email Sending with Queue](#asynchronous-email-sending-with-queue)
4. [Session Storage in Redis](#session-storage-in-redis)
5. [Key Management Service for Secrets](#key-management-service-for-secrets)
6. [JWT with Asymmetric Keys (RS256)](#jwt-with-asymmetric-keys-rs256)
7. [Switch to Scalable Email Service (AWS SES or SendGrid)](#switch-to-scalable-email-service-aws-ses-or-sendgrid)
8. [Database Sharding/Partitioning](#database-sharding-or-partitioning)
9. [Audit Log Offloading to Queue](#audit-log-offloading-to-queue)
10. [Failed Login Tracking and Account Lockout](#failed-login-tracking-and-account-lockout)
11. [Localization for Email Templates](#localization-for-email-templates)
12. [GDPR/CCPA Compliance](#gdpr-ccpa-compliance)
13. [Email-Service Enhancements](#email-service-enhancements)
14. [Logout Enhancements](#logout-enhancements)
15. [Frontend Authentication Enhancements](#frontend-authentication-enhancements)

---

## 1. Cron Jobs for Token and Session Cleanup

- **Description**: Implement a scheduled job to delete expired `VerificationToken`, `ResetToken`, and `Session` records to prevent database bloat.
- **Priority**: Medium (critical as user base grows to thousands).
- **Estimated Effort**: 4-6 hours.
- **Implementation Notes**:
  - Use a library like `node-cron` or Vercel’s cron jobs to schedule a daily/weekly task.
  - Example code:
    ```javascript
    import { schedule } from 'node-cron';
    import prisma from '@/lib/prisma';
    schedule('0 0 * * *', async () => {
      await prisma.$transaction([
        prisma.verificationToken.deleteMany({
          where: { expiresAt: { lte: new Date() } },
        }),
        prisma.resetToken.deleteMany({
          where: { expiresAt: { lte: new Date() } },
        }),
        prisma.session.deleteMany({
          where: { expiresAt: { lte: new Date() } },
        }),
      ]);
    });
    ```
  - Leverage Prisma Accelerate’s caching to minimize query impact.
  - Log cleanup actions in `AuditLog` for traceability.

## 2. Rate-Limiting for Sensitive Endpoints

- **Description**: Implement rate-limiting for `/register`, `/login`, `/resend-email-verification-link`, `/request-password-reset-link`, and `/logout` to prevent abuse (e.g., brute-force, DDoS).
- **Priority**: High (essential for security with a growing user base).
- **Estimated Effort**: 6-8 hours.
- **Implementation Notes**:
  - Use `express-rate-limit` or Vercel’s edge middleware for rate-limiting.
  - Example for `/login` with Redis-backed rate-limiting:
    ```javascript
    import rateLimit from 'express-rate-limit';
    import { createClient } from 'redis';
    const redis = createClient();
    const loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per IP
      message: 'Too many login attempts, please try again later',
      store: new RedisStore({ client: redis }),
    });
    ```
  - Apply to `/register` (e.g., 3/hour/IP), `/resend-email-verification-link` (3/hour/email), `/request-password-reset-link` (3/hour/email), and `/logout` (10/hour/IP).
  - Log rate-limit triggers in `AuditLog`.

## 3. Asynchronous Email Sending with Queue

- **Description**: Offload email sending (verification, password reset, password change confirmation) to a queue to ensure API responsiveness under high load.
- **Priority**: Medium (important for performance with thousands of users).
- **Estimated Effort**: 8-10 hours.
- **Implementation Notes**:
  - Use BullMQ with Redis for queue management.
  - Example setup in `email-service.js`:
    ```javascript
    import { Queue } from 'bullmq';
    const emailQueue = new Queue('emails', { connection: { host: 'redis' } });
    export async function sendVerificationEmail(email, verificationLink) {
      await emailQueue.add('sendVerificationEmail', {
        email,
        verificationLink,
      });
    }
    ```
  - Create a worker to process the queue:
    ```javascript
    import { Worker } from 'bullmq';
    import emailjs from '@emailjs/browser';
    const worker = new Worker(
      'emails',
      async (job) => {
        const { email, verificationLink } = job.data;
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_EMAIL_CONFIRMATION_TEMPLATEID,
          { email, link: verificationLink }
        );
      },
      { connection: { host: 'redis' } }
    );
    ```
  - Ensure error handling and retries for failed email sends.

## 4. Session Storage in Redis

- **Description**: Move session storage from the database to Redis to reduce database load and improve performance.
- **Priority**: Medium (critical for high concurrency).
- **Estimated Effort**: 8-12 hours.
- **Implementation Notes**:
  - Modify `session-service.js` to use Redis:
    ```javascript
    import { createClient } from 'redis';
    const redis = createClient();
    export async function createSession(user, ipAddress, userAgent) {
      const session = {
        id: crypto.randomUUID(),
        userId: user.id,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
      };
      await redis.set(`session:${session.id}`, JSON.stringify(session), {
        EX: REFRESH_TOKEN_MAX_AGE,
      });
      return createSessionTokens(user, session);
    }
    export async function validateSession(sessionId, userId) {
      const sessionData = await redis.get(`session:${sessionId}`);
      if (!sessionData) return null;
      const session = JSON.parse(sessionData);
      if (session.userId !== userId || new Date(session.expiresAt) < new Date())
        return null;
      return session;
    }
    ```
  - Update `/refresh-token` and `/logout` routes to use `validateSession`.
  - Ensure Redis is configured with persistence and high availability.

## 5. Key Management Service for Secrets

- **Description**: Use a key management service (e.g., AWS KMS, HashiCorp Vault) for secure storage and rotation of `ENCRYPTION_SECRET`, `JWT_SECRET`, and `REFRESH_SECRET`.
- **Priority**: High (critical for security).
- **Estimated Effort**: 10-12 hours.
- **Implementation Notes**:
  - Example with AWS KMS:
    ```javascript
    import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
    const kms = new KMSClient({ region: 'us-east-1' });
    async function getSecret(keyId) {
      const response = await kms.send(
        new DecryptCommand({
          CiphertextBlob: Buffer.from(process.env.ENCRYPTED_SECRET, 'base64'),
          KeyId: keyId,
        })
      );
      return response.Plaintext.toString();
    }
    ```
  - Update `security.js` and `jwt.js` to fetch secrets dynamically.
  - Schedule key rotation (e.g., every 90 days) and update environment variables.

## 6. JWT with Asymmetric Keys (RS256)

- **Description**: Replace HS256 with RS256 for JWTs to support secure key rotation.
- **Priority**: Medium (enhances security).
- **Estimated Effort**: 6-8 hours.
- **Implementation Notes**:
  - Generate key pair:
    ```bash
    openssl genrsa -out private.pem 2048
    openssl rsa -in private.pem -pubout -out public.pem
    ```
  - Update `jwt.js`:
    ```javascript
    import { readFileSync } from 'fs';
    import jwt from 'jsonwebtoken';
    const privateKey = readFileSync('private.pem');
    const publicKey = readFileSync('public.pem');
    export async function generateAccessToken(payload) {
      return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      });
    }
    export async function verifyAccessToken(token) {
      return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    }
    ```
  - Update `generateRefreshToken` and `verifyRefreshToken` similarly.
  - Store keys securely (e.g., in AWS KMS).

## 7. Switch to Scalable Email Service (AWS SES or SendGrid)

- **Description**: Replace EmailJS with a scalable email service like AWS SES or SendGrid for better deliverability and analytics.
- **Priority**: Medium (important for global user base).
- **Estimated Effort**: 8-10 hours.
- **Implementation Notes**:
  - Example with AWS SES in `email-service.js`:
    ```javascript
    import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
    const ses = new SESClient({ region: 'us-east-1' });
    export async function sendVerificationEmail(email, verificationLink) {
      await ses.send(
        new SendEmailCommand({
          Destination: { ToAddresses: [email] },
          Message: {
            Subject: { Data: 'Verify Your Email' },
            Body: {
              Html: { Data: `<a href="${verificationLink}">Verify</a>` },
            },
          },
          Source: 'no-reply@yourdomain.com',
        })
      );
    }
    ```
  - Configure DKIM/SPF for better deliverability.
  - Update `sendPasswordResetEmail` and `sendPasswordResetConfirmationEmail` similarly.

## 8. Database Sharding/Partitioning

- **Description**: Configure the database for sharding or partitioning to handle high write loads on `Session` and `AuditLog` tables.
- **Priority**: Low (relevant for very large scale).
- **Estimated Effort**: 12-16 hours.
- **Implementation Notes**:
  - Use a distributed database like CockroachDB or PlanetScale with Prisma Accelerate.
  - Partition `Session` by `createdAt` or `userId`:
    ```prisma
    model Session {
      id        String   @id @default(uuid())
      userId    String?
      user      User?    @relation(fields: [userId], references: [id])
      ipAddress String?
      userAgent String?
      expiresAt DateTime
      createdAt DateTime @default(now())
      cart      Cart?    @relation("CartSessions", fields: [cartId], references: [id])
      cartId    String?  @unique
      @@index([userId, createdAt])
    }
    ```
  - Work with your database provider to configure sharding rules.

## 9. Audit Log Offloading to Queue

- **Description**: Offload `AuditLog` writes to a queue to reduce database load during authentication actions.
- **Priority**: Medium (important for performance).
- **Estimated Effort**: 6-8 hours.
- **Implementation Notes**:
  - Use BullMQ for audit logging:
    ```javascript
    import { Queue } from 'bullmq';
    const auditQueue = new Queue('audit-logs', {
      connection: { host: 'redis' },
    });
    async function logAudit(action, model, modelId, userId, details) {
      await auditQueue.add('log', { action, model, modelId, userId, details });
    }
    ```
  - Create a worker:
    ```javascript
    import { Worker } from 'bullmq';
    import prisma from '@/lib/prisma';
    const worker = new Worker(
      'audit-logs',
      async (job) => {
        const { action, model, modelId, userId, details } = job.data;
        await prisma.auditLog.create({
          data: {
            action,
            model,
            modelId,
            userId,
            details,
            createdAt: new Date(),
          },
        });
      },
      { connection: { host: 'redis' } }
    );
    ```
  - Update `user-service.js`, `password-reset.js`, and `logout` routes to use `logAudit`.

## 10. Failed Login Tracking and Account Lockout

- **Description**: Add `failedLoginAttempts` and `lastFailedLogin` to the `User` model to track and lock accounts after multiple failed login attempts.
- **Priority**: High (critical for security).
- **Estimated Effort**: 6-8 hours.
- **Implementation Notes**:
  - Update Prisma schema:
    ```prisma
    model User {
      failedLoginAttempts Int      @default(0)
      lastFailedLogin    DateTime?
      // ... other fields
    }
    ```
  - Update `loginUser`:
    ```javascript
    export async function loginUser({ email, password, ipAddress, userAgent }) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');
      if (
        user.failedLoginAttempts >= 5 &&
        user.lastFailedLogin > new Date(Date.now() - 15 * 60 * 1000)
      ) {
        throw new Error('Account locked. Try again in 15 minutes.');
      }
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: { increment: 1 },
            lastFailedLogin: new Date(),
          },
        });
        await prisma.auditLog.create({
          data: {
            action: 'LOGIN_FAILED',
            model: 'User',
            modelId: user.id,
            userId: user.id,
            details: { email, ipAddress, userAgent },
            createdAt: new Date(),
          },
        });
        throw new Error('Invalid credentials');
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lastFailedLogin: null },
      });
      // ... rest of login logic
    }
    ```

## 11. Localization for Email Templates

- **Description**: Support multiple languages in email templates for global users.
- **Priority**: Medium (important for global reach).
- **Estimated Effort**: 8-10 hours.
- **Implementation Notes**:
  - Use a template engine like Handlebars with i18n:
    ```javascript
    import Handlebars from 'handlebars';
    import i18n from 'i18next';
    await i18n.init({
      lng: user.language || 'en',
      resources: {
        /* translation files */
      },
    });
    const template = Handlebars.compile(
      'Verify your email: <a href="{{link}}">{{t "verify"}}</a>'
    );
    const html = template({ link: verificationLink, t: i18n.t });
    ```
  - Store user language preference in `User` model:
    ```prisma
    model User {
      language String? @default("en")
      // ... other fields
    }
    ```

## 12. GDPR/CCPA Compliance

- **Description**: Implement consent management and data deletion options for GDPR/CCPA compliance.
- **Priority**: High (legal requirement for global users).
- **Estimated Effort**: 12-16 hours.
- **Implementation Notes**:
  - Add consent tracking to `User` model:
    ```prisma
    model User {
      consentGiven Boolean @default(false)
      consentDate  DateTime?
      // ... other fields
    }
    ```
  - Create a `/delete-account` endpoint to delete user data:
    ```javascript
    export async function POST(request) {
      const { userId } = await validateDeleteAccount(request);
      await prisma.$transaction([
        prisma.user.delete({ where: { id: userId } }),
        prisma.auditLog.create({
          data: {
            action: 'ACCOUNT_DELETED',
            model: 'User',
            modelId: userId,
            userId,
            details: { reason: 'User request' },
            createdAt: new Date(),
          },
        }),
      ]);
      return NextResponse.json({ message: 'Account deleted' }, { status: 200 });
    }
    ```
  - Log consent actions in `AuditLog`.

## 13. Email-Service Enhancements

- **Description**: Ensure EmailJS service continuity and improve email templates for better user experience.
- **Priority**: High (critical for maintaining email functionality and user engagement).
- **Estimated Effort**: 6-8 hours.
- **Implementation Notes**:
  - [ ] **Pay EmailJS Subscription**:
    - Ensure the EmailJS subscription is active to maintain service availability.
    - Action: Log in to the EmailJS dashboard, verify subscription status, and set up auto-renewal or calendar reminders for renewal.
  - [ ] **Improve Current Templates**:
    - **Email Verification Email**:
      - Enhance the template with branding (e.g., logo, colors), clear call-to-action (e.g., "Verify Now" button), and concise messaging.
      - Example (in EmailJS dashboard):
        ```html
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <img src="your-logo-url" alt="Logo" style="width: 150px;" />
          <h2>Verify Your Email</h2>
          <p>Click the button below to verify your account:</p>
          <a
            href="{{link}}"
            style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
            >Verify Now</a
          >
          <p>If the button doesn't work, copy and paste this link: {{link}}</p>
        </div>
        ```
    - **Password Reset Link Email**:
      - Update with consistent branding, a secure and clear reset link, and expiration information (e.g., "Link expires in 24 hours").
      - Example:
        ```html
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <img src="your-logo-url" alt="Logo" style="width: 150px;" />
          <h2>Reset Your Password</h2>
          <p>
            Click the button below to reset your password. This link expires in
            24 hours:
          </p>
          <a
            href="{{link}}"
            style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
            >Reset Password</a
          >
          <p>If the button doesn't work, copy and paste this link: {{link}}</p>
        </div>
        ```
  - [ ] **Create New Template**:
    - **Password Change Confirmation Email**:
      - Create a new template in EmailJS for password change confirmation to notify users of successful password updates.
      - Example:
        ```html
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <img src="your-logo-url" alt="Logo" style="width: 150px;" />
          <h2>Password Changed Successfully</h2>
          <p>
            Your password has been updated on {{date}}. If you did not make this
            change, please contact support immediately.
          </p>
          <a
            href="your-support-url"
            style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
            >Contact Support</a
          >
        </div>
        ```
      - Update `email-service.js` to use the new template:
        ```javascript
        export async function sendPasswordResetConfirmationEmail(email) {
          const response = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env
              .NEXT_PUBLIC_EMAILJS_PASSWORD_CHANGE_CONFIRMATION_TEMPLATEID,
            { email, date: new Date().toISOString() }
          );
          if (response.status !== 200) throw new Error(response.text);
          return response;
        }
        ```
      - Add `NEXT_PUBLIC_EMAILJS_PASSWORD_CHANGE_CONFIRMATION_TEMPLATEID` to `.env`:
        ```env
        NEXT_PUBLIC_EMAILJS_PASSWORD_CHANGE_CONFIRMATION_TEMPLATEID=your-template-id
        ```
      - Test the template in the EmailJS dashboard and verify integration.

## 14. Logout Enhancements

- **Description**: Enhance the `/logout` endpoint to improve security and scalability for a growing user base.
- **Priority**: Medium (important for security and traceability).
- **Estimated Effort**: 4-6 hours.
- **Implementation Notes**:
  - [ ] **Rate-Limit Logout Endpoint**:
    - Add rate-limiting to prevent abuse of the `/logout` endpoint (e.g., 10 requests/hour/IP).
    - Example with `express-rate-limit`:
      ```javascript
      import rateLimit from 'express-rate-limit';
      const logoutLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // 10 attempts per IP
        message: 'Too many logout attempts, please try again later',
      });
      // Apply to /logout route
      ```
    - Log rate-limit triggers in `AuditLog`.
  - [ ] **Optional Multi-Session Invalidation**:
    - Allow users to invalidate all active sessions (e.g., for account security).
    - Example in `logout/route.js`:
      ```javascript
      export async function POST(request) {
        const { allSessions } = await request.json();
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (!refreshToken) {
          return NextResponse.json(
            { message: 'No active session found' },
            { status: 400 }
          );
        }
        const payload = await verifyRefreshToken(refreshToken);
        const { sessionId, userId } = payload;
        if (allSessions) {
          await prisma.$transaction([
            prisma.session.updateMany({
              where: { userId },
              data: { expiresAt: new Date() },
            }),
            prisma.auditLog.create({
              data: {
                action: 'LOGOUT_ALL_SESSIONS',
                model: 'Session',
                modelId: userId,
                userId,
                details: {
                  ipAddress:
                    request.headers.get('x-forwarded-for') || 'unknown',
                },
                createdAt: new Date(),
              },
            }),
          ]);
        } else {
          await prisma.$transaction([
            prisma.session.update({
              where: { id: sessionId, userId },
              data: { expiresAt: new Date() },
            }),
            prisma.auditLog.create({
              data: {
                action: 'LOGOUT',
                model: 'Session',
                modelId: sessionId,
                userId,
                details: {
                  ipAddress:
                    request.headers.get('x-forwarded-for') || 'unknown',
                },
                createdAt: new Date(),
              },
            }),
          ]);
        }
        const response = NextResponse.json(
          { message: 'Logged out successfully' },
          { status: 200 }
        );
        response.cookies.set('accessToken', '', {
          httpOnly: true,
          maxAge: 0,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });
        response.cookies.set('refreshToken', '', {
          httpOnly: true,
          maxAge: 0,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });
        return response;
      }
      ```
    - Add a `validateLogout` function in `validators.js` to validate the `allSessions` parameter:
      ```javascript
      import { z } from 'zod';
      export const logoutSchema = z.object({
        allSessions: z.boolean().optional().default(false),
      });
      export async function validateLogout(request) {
        const body = await request.json();
        return logoutSchema.parse(body);
      }
      ```
    - Test multi-session invalidation in a staging environment.

## 15. Frontend Authentication Enhancements

- **Description**: Improve the frontend authentication flow for better user experience, security, and performance in an enterprise-grade e-commerce platform.
- **Priority**: High (critical for user experience and security).
- **Estimated Effort**: 10-12 hours.
- **Implementation Notes**:
  - [ ] **Redirect Users to Initial Page After Login/Verification**:
    - Implement middleware to capture the intended URL for protected routes and redirect users back after login or email verification.
    - Example middleware (`src/middleware/authMiddleware.js`):
      ```javascript
      import { NextResponse } from 'next/server';
      import { ROUTES } from '@/constants/routes';
      export function middleware(request) {
        const { pathname, searchParams } = request.nextUrl;
        const accessToken = request.cookies.get('accessToken')?.value;
        const refreshToken = request.cookies.get('refreshToken')?.value;
        const protectedRoutes = [
          ROUTES.account,
          ROUTES.checkout,
          ROUTES.settings,
        ];
        if (
          protectedRoutes.some((route) => pathname.startsWith(route)) &&
          !accessToken &&
          !refreshToken
        ) {
          const redirectUrl = new URL(ROUTES.login, request.url);
          redirectUrl.searchParams.set(
            'redirect',
            pathname + searchParams.toString()
          );
          return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
      }
      export const config = {
        matcher: [
          '/account/:path*',
          '/cart/checkout/:path*',
          '/account/settings/:path*',
        ],
      };
      ```
    - Update `useSessionBoot` to store `redirect` in Redux:
      ```javascript
      useEffect(() => {
        const redirect = searchParams.get('redirect');
        if (redirect) {
          dispatch(setLastVisitedPage(decodeURIComponent(redirect)));
        }
        // ... rest of the logic
      }, [dispatch, searchParams]);
      ```
    - Update `loginUser` and `verifyEmail` thunks to redirect to `lastVisitedPage` or `/home`.
  - [ ] **CSRF Protection for POST Requests**:
    - Add CSRF token generation and validation for POST requests (login, signup, logout, etc.).
    - Example (`src/lib/auth/csrf.js`):
      ```javascript
      export async function getCsrfToken() {
        const response = await fetch('/api/v1/auth/csrf', {
          method: 'GET',
          credentials: 'include',
        });
        const { csrfToken } = await response.json();
        return csrfToken;
      }
      ```
    - Update backend routes to validate CSRF tokens:
      ```javascript
      export async function POST(request) {
        const csrfToken = request.headers.get('X-CSRF-Token');
        const storedCsrfToken = Cookies.get('csrfToken');
        if (csrfToken !== storedCsrfToken) {
          return NextResponse.json(
            { message: 'Invalid CSRF token' },
            { status: 403 }
          );
        }
        // ... existing logic
      }
      ```
  - [ ] **Debounce Form Submissions**:
    - Add debouncing to form submissions in `LoginContainer`, `SignupContainer`, `ResetPasswordContainer`, and `ForgotPasswordContainer` to prevent multiple rapid API calls.
    - Example (`src/utils/debounce.js`):
      ```javascript
      export function debounce(func, wait) {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), wait);
        };
      }
      ```
    - Update `LoginContainer`:
      ```javascript
      const handleLogin = useMemo(
        () =>
          debounce((values) => {
            dispatch(loginUser({ ...values, router }));
          }, 300),
        [dispatch, router]
      );
      ```
  - [ ] **Fix Password Visibility Toggles**:
    - Implement separate visibility toggles for `password` and `confirmPassword` in `ResetPasswordContainer`.
    - Example:
      ```javascript
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      ```
  - [ ] **Standardize Error Handling**:
    - Ensure consistent error structures (`{ message, code }`) from backend and handle in frontend.
    - Example in `authSlice.js`:
      ```javascript
      .addCase(loginUser.rejected, (state, action) => {
        const error = action.payload || { message: 'An unexpected error occurred' };
        state.isLoading = false;
        state.error = error.message;
        showErrorToast(error.message);
      });
      ```
  - [ ] **Improve Session Boot**:
    - Handle invalid/stale cookies in `useSessionBoot` by clearing state and redirecting to `/login`.
    - Example:
      ```javascript
      useEffect(() => {
        const bootSession = async () => {
          if (accessToken && refreshToken) {
            try {
              await dispatch(refreshAccessToken()).unwrap();
            } catch {
              dispatch(logoutUser({ router }));
            }
          }
        };
        bootSession();
      }, [accessToken, dispatch, refreshToken, router]);
      ```

---

## Additional Notes

- **Prioritization**: Focus on high-priority tasks (EmailJS subscription, rate-limiting, key management, failed login tracking, GDPR/CCPA, frontend redirect handling, CSRF protection) to ensure service continuity, security, and user experience.
- **Testing**: Test redirect handling, CSRF protection, and form debouncing in a staging environment. Verify email templates, session invalidation, and audit logging. Use load testing for database and queue changes (e.g., Redis, BullMQ).
- **Monitoring**: Use tools like Sentry or Datadog to monitor email delivery failures, rate-limit triggers, logout actions, and frontend errors after implementing changes.
- **Dependencies**: Add required dependencies (`node-cron`, `bullmq`, `redis`, `@aws-sdk/client-ses`, `i18next`, `express-rate-limit`) to `package.json`.

## Conversion to PDF

To convert this README.md to a PDF:

1. Install `pandoc` and a LaTeX engine (e.g., `texlive`).
2. Run:
   ```bash
   pandoc README.md -o TODO.pdf --pdf-engine=xelatex
   ```
