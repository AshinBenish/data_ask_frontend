import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export const getTableList = async (token: string | undefined, session_id: string) => {
    return await axios.post(`${API_BASE}/database/list-tables/`, { session_id }, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

export const connectDb = async (token: string | undefined, host: string, db_user: string, db_name: string, password: string, port: string) => {
    const payload = {
        host: host,
        db_user: db_user,
        db_name: db_name,
        password: password,
        port: port
    };
    return await axios.post(`${API_BASE}/database/connections/`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};