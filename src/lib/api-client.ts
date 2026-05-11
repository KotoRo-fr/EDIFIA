const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v2";

class ApiClient {
  async request(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  // Compliance
  evaluateCompliance(projectId: string, variantId?: string) {
    return this.request(`/compliance/evaluate/${projectId}`, {
      method: "POST",
      body: JSON.stringify({ variant_id: variantId || null }),
    });
  }

  getComplianceReport(projectId: string) {
    return this.request(`/compliance/report/${projectId}`);
  }

  listRules(category?: string, page = 1) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("page", String(page));
    return this.request(`/compliance/rules?${params}`);
  }

  // Site Intelligence
  geocodeAddress(address: string) {
    return this.request(`/site/geocode?address=${encodeURIComponent(address)}`);
  }

  getSiteIntel(projectId: string) {
    return this.request(`/site/intel/${projectId}`);
  }

  getPLU(communeCode: string) {
    return this.request(`/site/plu/${communeCode}`);
  }
}

export const api = new ApiClient();
