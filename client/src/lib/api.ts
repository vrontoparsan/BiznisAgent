const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Chyba servera' }));
    throw new Error(error.error || 'Chyba servera');
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: (token: string) =>
    request('/auth/me', { token }),

  // Emails
  getEmails: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request(`/emails${query}`, { token });
  },

  getEmail: (id: number, token: string) =>
    request(`/emails/${id}`, { token }),

  updateEmail: (id: number, data: any, token: string) =>
    request(`/emails/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  // Customers
  getCustomers: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request(`/customers${query}`, { token });
  },

  getCustomer: (id: number, token: string) =>
    request(`/customers/${id}`, { token }),

  createCustomer: (data: any, token: string) =>
    request('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateCustomer: (id: number, data: any, token: string) =>
    request(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  // Products
  getProducts: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request(`/products${query}`, { token });
  },

  getCategories: (token: string) =>
    request('/products/categories', { token }),

  createProduct: (data: any, token: string) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateProduct: (id: number, data: any, token: string) =>
    request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  // Documents
  getQuotes: (token: string) =>
    request('/documents/quotes', { token }),

  createQuote: (data: any, token: string) =>
    request('/documents/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  getInvoices: (token: string) =>
    request('/documents/invoices', { token }),

  createInvoice: (data: any, token: string) =>
    request('/documents/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  getOrders: (token: string) =>
    request('/documents/orders', { token }),

  createOrder: (data: any, token: string) =>
    request('/documents/orders', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  getDeliveryNotes: (token: string) =>
    request('/documents/delivery-notes', { token }),

  // Complaints
  getComplaints: (token: string) =>
    request('/complaints', { token }),

  createComplaint: (data: any, token: string) =>
    request('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateComplaint: (id: number, data: any, token: string) =>
    request(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  // Dashboard
  getDashboardStats: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request(`/dashboard/stats${query}`, { token });
  },

  getKPI: (token: string) =>
    request('/dashboard/kpi', { token }),

  // Settings
  getCompany: (token: string) =>
    request('/settings/company', { token }),

  updateCompany: (data: any, token: string) =>
    request('/settings/company', {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  getUsers: (token: string) =>
    request('/settings/users', { token }),

  createUser: (data: any, token: string) =>
    request('/settings/users', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateUser: (id: number, data: any, token: string) =>
    request(`/settings/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),
};
