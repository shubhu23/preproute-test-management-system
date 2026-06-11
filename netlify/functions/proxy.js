const BACKEND_URL = 'https://admin-moderator-backend-staging.up.railway.app/api';

exports.handler = async (event, context) => {
  try {
    // Extract path from the redirected URL
    // event.path will be something like: /.netlify/functions/proxy/auth/login
    let path = event.path;
    
    // Remove the function path to get the API path
    if (path.startsWith('/.netlify/functions/proxy')) {
      path = path.replace('/.netlify/functions/proxy', '');
    }
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

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
    const fullURL = `${BACKEND_URL}${path}`;
    console.log(`Proxying ${method} request to: ${fullURL}`);
    
    const response = await fetch(fullURL, {
      method,
      headers,
      body,
    });

    const data = await response.json();
    
    console.log(`Response status: ${response.status}`);

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
