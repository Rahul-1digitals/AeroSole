// API service for backend communication

const API_BASE_URL = 'http://localhost:8000';

export const searchProducts = async (query) => {
  try {
    const searchQuery = `${query}`;
    
    const response = await fetch(`${API_BASE_URL}/api/invoke_agent`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('API Response:', data); // Debug log
    
    // Check if the request was successful
    if (data.completion_status === 'success' && data.result && data.result.products && data.result.products.length > 0) {
      const firstProduct = data.result.products[0];
      console.log('First Product:', firstProduct); // Debug log
      
      return {
        success: true,
        product: firstProduct, // Return first product
        allProducts: data.result.products,
        productCount: data.result.product_count
      };
    } else {
      console.log('API Error: No products found or invalid response'); // Debug log
      return {
        success: false,
        error: 'No products found or invalid response'
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
