export function validateApiKey(request: Request, env: Env): boolean {
    const authHeader = request.headers.get('Authorization');
    const apiKey = request.headers.get('X-API-Key');
    
    // Check for API key in Authorization header (Bearer token)
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        return token === env.API_SECRET;
    }
    
    // Check for API key in X-API-Key header
    if (apiKey) {
        return apiKey === env.API_SECRET;
    }
    
    return false;
}

export function createAuthResponse(): Response {
    return new Response('Unauthorized', { 
        status: 401,
        headers: {
            'Content-Type': 'text/plain',
            'WWW-Authenticate': 'Bearer'
        }
    });
}