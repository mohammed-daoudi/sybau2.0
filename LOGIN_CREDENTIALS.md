# Admin Login Credentials

## Admin Account 1
- **Email:** admin@sybau.com
- **Password:** admin123

## Admin Account 2
- **Email:** admin@ouswear.com
- **Password:** admin123

---

## How to Access Admin Dashboard

1. Navigate to `/auth/signin`
2. Enter one of the admin credentials above
3. After successful login, navigate to `/admin`

## Troubleshooting

If you encounter "Too Many Requests" error:
- The rate limiting has been removed from auth routes
- Clear your browser cache and cookies
- Try again

If admin dashboard doesn't show:
- Check browser console for errors
- Verify the user role is "admin" in the session
- Ensure the mock database is initialized properly
