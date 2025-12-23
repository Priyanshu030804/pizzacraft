# CORS Configuration Fix - README

## Problem

Frontend running on LAN IP (`http://172.26.91.12:5173`) was blocked by CORS policy because the backend only allowed `localhost` origins.

## Solution Applied

Updated `server/index.js` to dynamically allow:

- Exact match origins from `FRONTEND_URL` environment variable
- All localhost ports (5173, 5001, 3001)
- All LAN IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x) with allowed ports

### Changes Made

1. **Dynamic Origin Validation**: Added `isOriginAllowed()` function that checks:

   - Exact matches from `allowedOrigins` array
   - Pattern-based matching for private network IPs

2. **Socket.IO CORS**: Updated Socket.IO server to use the same dynamic origin validation

3. **Supported IP Ranges**:

   - `192.168.0.0/16` (Class C private networks)
   - `10.0.0.0/8` (Class A private networks)
   - `172.16.0.0/12` (Class B private networks)

4. **Allowed Ports**: 5173 (Vite), 5001 (admin), 3001 (backend)

## Testing

After restarting the server, the frontend on `http://172.26.91.12:5173` should now be able to:

- Fetch from `/api/health`
- Make login requests to `/api/auth/login`
- Connect via Socket.IO for real-time updates

## Environment Configuration

To customize allowed origins, set `FRONTEND_URL` in `.env`:

```env
FRONTEND_URL=http://localhost:5173,http://192.168.1.100:5173,https://yourdomain.com
```

## Security Notes

- LAN IP ranges are only allowed for development convenience
- For production, use explicit domain whitelist via `FRONTEND_URL`
- The pattern matcher prevents external IPs from being allowed
- All origins log warnings when blocked for debugging

## Server Status

✅ Server running on port 3001
✅ MongoDB connected
✅ Socket.IO initialized
✅ CORS configured for LAN access
