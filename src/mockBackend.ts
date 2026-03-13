const originalFetch = window.fetch;

const defaultMemberships = [
  { id: 1, name: 'Basic', price: '$29', duration: '1 Month', features: ['Access to gym equipment', 'Locker room access', 'Free WiFi'] },
  { id: 2, name: 'Standard', price: '$49', duration: '1 Month', features: ['Access to gym equipment', 'Locker room access', 'Free WiFi', 'Group classes', '1 PT session/month'] },
  { id: 3, name: 'Premium', price: '$89', duration: '1 Month', features: ['Access to gym equipment', 'Locker room access', 'Free WiFi', 'Group classes', 'Unlimited PT sessions', 'Sauna access'] }
];

const defaultTrainers = [
  { id: 1, name: 'John Doe', experience: '5 Years', specialization: 'Bodybuilding', photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500&q=80' },
  { id: 2, name: 'Jane Smith', experience: '3 Years', specialization: 'Yoga & Pilates', photoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80' },
  { id: 3, name: 'Mike Johnson', experience: '7 Years', specialization: 'CrossFit', photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' }
];

const defaultGallery = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', title: 'Main Workout Area' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', title: 'Cardio Section' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', title: 'Free Weights' },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', title: 'Yoga Studio' }
];

const getData = (key: string, defaultData: any) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (e) {
    return defaultData;
  }
};

const setData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};

const mockFetch: typeof window.fetch = async (...args) => {
  const [resource, config] = args;
  const url = typeof resource === 'string' ? resource : (resource instanceof Request ? resource.url : '');

  if (!url.includes('/api/')) {
    return originalFetch(...args);
  }

  const urlObj = new URL(url, window.location.origin);
  const path = urlObj.pathname;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const method = config?.method || (resource instanceof Request ? resource.method : 'GET');
  let body = null;
  if (config?.body) {
    body = JSON.parse(config.body as string);
  }

  if (path === '/api/auth/login' && method === 'POST') {
    if (body?.username === 'admin' && body?.password === 'admin123') {
      return new Response(JSON.stringify({ token: 'demo-admin-token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const match = path.match(/^\/api\/([a-zA-Z]+)\/?(\d+)?$/);
  if (!match) {
    return new Response('Not Found', { status: 404 });
  }

  const endpoint = match[1];
  const id = match[2] ? parseInt(match[2]) : null;

  let defaultData: any[] = [];
  if (endpoint === 'memberships') defaultData = defaultMemberships;
  else if (endpoint === 'trainers') defaultData = defaultTrainers;
  else if (endpoint === 'gallery') defaultData = defaultGallery;
  else if (endpoint === 'inquiries') defaultData = [];
  else return new Response('Not Found', { status: 404 });

  let items = getData(endpoint, defaultData);

  if (method === 'GET') {
    if (id) {
      const item = items.find((i: any) => i.id === id);
      return new Response(JSON.stringify(item), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (endpoint === 'inquiries') {
      items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return new Response(JSON.stringify(items), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (method === 'POST') {
    const newItem = { ...body, id: Date.now() };
    if (endpoint === 'inquiries') {
      newItem.createdAt = new Date().toISOString();
    }
    items.push(newItem);
    setData(endpoint, items);
    return new Response(JSON.stringify(newItem), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (method === 'PUT' && id) {
    items = items.map((i: any) => i.id === id ? { ...body, id } : i);
    setData(endpoint, items);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (method === 'DELETE' && id) {
    items = items.filter((i: any) => i.id !== id);
    setData(endpoint, items);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

try {
  window.fetch = mockFetch;
} catch (error) {
  Object.defineProperty(window, 'fetch', {
    value: mockFetch,
    configurable: true,
    writable: true
  });
}
