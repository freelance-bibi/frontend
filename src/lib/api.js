import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "studwork_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      const onAuthPage = ["/login", "/register"].includes(
        window.location.pathname
      );
      if (!onAuthPage) {
        setToken(null);
        window.dispatchEvent(new Event("studwork:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export function extractError(error, fallback = "Что-то пошло не так") {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
  }
  if (error?.message) return error.message;
  return fallback;
}

export const authApi = {
  async login(username, password) {
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);
    const { data } = await api.post("/users/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },
  async register(payload) {
    const { data } = await api.post("/users/register", payload);
    return data;
  },
  async me() {
    const { data } = await api.get("/users/me");
    return data;
  },
  async updateMe(payload) {
    const { data } = await api.patch("/users/me", payload);
    return data;
  },
  async getUser(userId) {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },
  async uploadAvatar(file) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/files/upload/avatar", form);
    return data;
  },
  async uploadBanner(file) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/files/upload/banner", form);
    return data;
  },
  async topUp(payload) {
    const body = typeof payload === "number" ? { amount: payload } : payload;
    const { data } = await api.post("/users/me/balance/topup", body);
    return data;
  },
  async transactions({ skip = 0, limit = 50 } = {}) {
    const { data } = await api.get("/users/me/transactions", {
      params: { skip, limit },
    });
    return data;
  },
};

export const kworksApi = {
  async list({ skip = 0, limit = 100 } = {}) {
    const { data } = await api.get("/kworks/", { params: { skip, limit } });
    return data;
  },
  async get(id) {
    const { data } = await api.get(`/kworks/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/kworks/", payload);
    return data;
  },
  async order(id) {
    const { data } = await api.post(`/kworks/${id}/order`);
    return data;
  },
  async updateStatus(id, payload) {
    const { data } = await api.patch(`/kworks/${id}/status`, payload);
    return data;
  },
  async complete(id) {
    const { data } = await api.post(`/kworks/${id}/complete`);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/kworks/${id}`);
    return data;
  },
  async uploadImage(id, file) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post(`/files/upload/kwork/${id}`, form);
    return data;
  },
};

export function chatSocketUrl(chatId) {
  const token = getToken();
  const wsBase = API_URL.replace(/^http/, "ws");
  return `${wsBase}/api/messages/ws/${chatId}?token=${encodeURIComponent(
    token || ""
  )}`;
}

export const chatsApi = {
  async my() {
    const { data } = await api.get("/chats/my");
    return data;
  },
  async get(id) {
    const { data } = await api.get(`/chats/${id}`);
    return data;
  },
  async messages(chatId, limit = 50) {
    const { data } = await api.get(`/messages/${chatId}`, { params: { limit } });
    return data;
  },
  async send(chatId, payload) {
    const body = typeof payload === "string" ? { text: payload } : payload;
    const { data } = await api.post(`/messages/${chatId}`, body);
    return data;
  },
  async uploadImage(chatId, file) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post(`/files/upload/chat/${chatId}`, form);
    return data;
  },
};

export const reviewsApi = {
  async forUser(userId) {
    const { data } = await api.get(`/reviews/user/${userId}`);
    return data;
  },
  async rating(userId) {
    const { data } = await api.get(`/reviews/user/${userId}/rating`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/reviews/", payload);
    return data;
  },
};

export const skillsApi = {
  async all() {
    const { data } = await api.get("/skills/");
    return data;
  },
  async my() {
    const { data } = await api.get("/skills/my");
    return data;
  },
  async forUser(userId) {
    const { data } = await api.get(`/skills/user/${userId}`);
    return data;
  },
  async addToMe(skillIds) {
    const { data } = await api.post("/skills/my", { skill_ids: skillIds });
    return data;
  },
  async removeFromMe(skillId) {
    const { data } = await api.delete(`/skills/my/${skillId}`);
    return data;
  },
  async create(name) {
    const { data } = await api.post("/skills/", { name });
    return data;
  },
};

export const portfolioApi = {
  async my() {
    const { data } = await api.get("/portfolio/my");
    return data;
  },
  async forUser(userId) {
    const { data } = await api.get(`/portfolio/user/${userId}`);
    return data;
  },
  async create(title) {
    const { data } = await api.post("/portfolio/", { title });
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/portfolio/${id}`);
    return data;
  },
  async uploadImage(id, file) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post(`/files/upload/portfolio/${id}`, form);
    return data;
  },
};
