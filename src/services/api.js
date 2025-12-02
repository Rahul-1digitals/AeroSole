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
    
    // Treat any completion_status === 'success' as a successful call,
    // even if product_count is 0 (no products found).
    if (data.completion_status === 'success' && data.result) {
      const products = Array.isArray(data.result.products) ? data.result.products : [];
      const firstProduct = products[0];

      console.log('First Product (may be undefined if no products):', firstProduct); // Debug log

      return {
        success: true,
        // Pass through the new API structure so pages like CustomShoeResult
        // can inspect result.product_count and result.products directly.
        ...data,
        // Backward-compatible fields for existing UI logic
        product: firstProduct,              // first product if present, otherwise undefined
        allProducts: products,              // full array (may be empty)
        productCount: data.result.product_count // numeric count, can be 0
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
