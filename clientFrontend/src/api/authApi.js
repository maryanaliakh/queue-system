export const API_URL = "http://192.168.110.200:8000";

async function request(path, method, body) {
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
}

export function registerUser(data) {
    return request("/api/auth/register", "POST", data);
}

export function loginUser(data) {
    return request("/api/auth/login", "POST", data);
}

export function verifyUser(data) {
    return request("/api/auth/verify", "POST", data);
}

export function forgotPasswordUser(data) {
    return request("/api/auth/forgot-password", "POST", data);
}

export function verifyResetCodeUser(data) {
    return request("/api/auth/verify-reset-code", "POST", data);
}

export function resetPasswordUser(data) {
    return request("/api/auth/reset-password", "POST", data);
}