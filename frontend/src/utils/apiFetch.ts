
const backendUrl = "http://localhost:8000"; // TODO: replace with env var

type Options = {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: object; 
}

export default async function apiFetch(endpoint: string, opt?: Options ) {
    const res = await fetch(`${backendUrl}${endpoint}`, {
        method: opt?.method || "GET",
        headers: {
            "Content-Type": "application/json"
        },
        body: opt?.body ? JSON.stringify(opt.body) : undefined
    });
    if (!res.ok) throw new Error("Could not fetch");
    
    return res.json();
}