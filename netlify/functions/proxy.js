const BACKEND_URL = process.env.VITE_API_BASE_URL || 'https://admin-moderator-backend-staging.up.railway.app/api';

exports.handler = async (event) => {
  try {
    // Get the path after /api
    const path = event.path.replace('/.netlify/functions/proxy', '');
    const method = event.httpMethod;
    
    // Build headers
    const headers = {
      'Content-Type': 'application/json',
    };

    // Pass through Authorization header if present
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization;
    }

    // Parse body if present
    let body = undefined;
    if (event.body) {
      body = event.httpMethod !== 'GET' && event.httpMethod !== 'DELETE' 
        ? JSON.stringify(JSON.parse(event.body))
        : undefined;
    }

    // Make the request to backend
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers,
      body,
    });

    const data = await response.json();

    // Return response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Proxy error',
        message: error.message 
      }),
    };
  }
};
