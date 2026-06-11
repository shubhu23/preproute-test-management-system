const BACKEND_URL = 'https://admin-moderator-backend-staging.up.railway.app/api';

exports.handler = async (event) => {
  try {
    // Get the original request path
    let path = event.path || '';
    
    // Remove the proxy function prefix if it exists
    if (path.includes('/.netlify/functions/proxy')) {
      path = path.split('/.netlify/functions/proxy')[1] || '';
    }
    
    // Build the target URL
    let targetURL = `${BACKEND_URL}${path}`;
    
    // Add query string if it exists
    if (event.queryStringParameters) {
      const queryString = new URLSearchParams(event.queryStringParameters).toString();
      targetURL += queryString ? `?${queryString}` : '';
    }

    const method = event.httpMethod || 'GET';
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };

    // Forward authorization header
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization;
    }

    // Prepare request body
    let body = null;
    if (event.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      body = event.isBase64Encoded 
        ? Buffer.from(event.body, 'base64').toString('utf-8')
        : event.body;
    }

    // Make the actual backend request
    const backendResponse = await fetch(targetURL, {
      method,
      headers,
      body,
    });

    // Parse the response
    const responseBody = await backendResponse.text();
    let parsedBody = responseBody;
    
    try {
      parsedBody = JSON.parse(responseBody);
    } catch (e) {
      // Response is not JSON, keep as text
    }

    // Return the response
    return {
      statusCode: backendResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: typeof parsedBody === 'string' ? parsedBody : JSON.stringify(parsedBody),
    };

  } catch (error) {
    console.error('Proxy error:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Proxy error',
        message: error.message,
      }),
    };
  }
};
