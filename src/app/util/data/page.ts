export const formatarData = (value: string): string => {
    value = value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (value.length === 8) {
        // Formata AAAAMMDD ou DDMMYYYY para DD/MM/YYYY
        value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    } else if (value.length > 4) {
        // Formata parcialmente DDMM para DD/MM
        value = value.replace(/(\d{2})(\d{2})/, "$1/$2");
    }

    return value;
};
