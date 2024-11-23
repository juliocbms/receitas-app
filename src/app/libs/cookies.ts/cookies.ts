// utils/cookies.ts

export const getTokenFromCookie = (): string | null => {
    const name = "jwt=";
    const decodedCookie = decodeURIComponent(document.cookie); // Decodifica o cookie
    const cookieArr = decodedCookie.split(';');
    
    // Procura por "jwt=" e retorna o valor do token
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length); // Retorna o valor do token
        }
    }
    return null; // Retorna null se não encontrar o token
};
