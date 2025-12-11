import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const api = {
    getDraws: (status?: string) => axios.get(`${API_BASE}/draws`, { params: { status } }),
    createDraw: (data: any) => axios.post(`${API_BASE}/draws`, data),
    pickWinners: (drawId: number) => axios.post(`${API_BASE}/draws/${drawId}/pick-winners`),
    getEntries: (drawId: number) => axios.get(`${API_BASE}/draws/${drawId}/entries`),
    getWinners: (drawId: number) => axios.get(`${API_BASE}/draws/${drawId}/winners`),
    getAuditLogs: () => axios.get(`${API_BASE}/audit-logs`),
};
