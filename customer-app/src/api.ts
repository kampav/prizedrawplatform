import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const api = {
    getActiveDraws: () => axios.get(`${API_BASE}/draws`, { params: { status: 'active' } }),
    enterDraw: (data: { draw_id: number, customer_email: string, customer_name: string, customer_id: string }) => axios.post(`${API_BASE}/entries`, data),
};
