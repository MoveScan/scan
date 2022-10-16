import http from "@/http/Http";

export async function login(data: { userName: string, password: string }) {
    return http.post(`/login`, data)
}

export async function getMsg() {
    return http.get(`/ping`)
}
