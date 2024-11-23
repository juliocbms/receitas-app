"use client"

import { getCookie } from "cookies-next/client"
import { signOut } from "next-auth/react"

export const fetchClient = async (
    input: string | URL | Request,
    init?: RequestInit | undefined
): Promise<Response> =>{
    const token = getCookie("jwt");

    const response = await fetch(input, {
        ...init,
        headers: {
            ...init?.headers,
            ...(token && { Authorization: `Bearer ${token}`}),
        },
    });
    if (response.status === 401){
        await signOut();
    }
    return response;
}