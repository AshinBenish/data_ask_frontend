import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export const getquestions = async (token: string | undefined, session_id: string | undefined) => {
    return await axios.post(`${API_BASE}/llm/query/recommend/`, { session_id }, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

export const getSqlQuery = async (token: string | undefined, session_id: string | undefined, query_question: string) => {
    return await axios.post(`${API_BASE}/llm/query/question/`, { session_id, query_question }, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

export const runSqlQuery = async (token: string | undefined, session_id: string | undefined, query: string) => {
    return await axios.post(`${API_BASE}/database/query/execute/`, { session_id, query }, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};