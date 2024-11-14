export const converterEmBigDecimal = (value: any) : number =>{
    if(!value){
        return 0;
    }
    return value.replace(".","").replace(",",".")
}

export const formatReal = (valor: any) => {
    // Remove todos os caracteres não numéricos e divide em parte inteira e decimal
    const v = ((valor.replace(/\D/g, '') / 100).toFixed(2) + '').split('.');

    // Cria o array de milhar invertido
    const m = v[0].split('').reverse().join('').match(/.{1,3}/g);

    if (!m) {
        return ''; // Retorna uma string vazia caso 'm' seja null
    }

    // Reverte e formata os grupos de 3 dígitos
    for (let i = 0; i < m.length; i++) {
        m[i] = m[i].split('').reverse().join('') + '.';
    }

    // Junta os grupos de 3 dígitos, remove a última vírgula e junta com a parte decimal
    const r = m.reverse().join('');
    return r.substring(0, r.lastIndexOf('.')) + ',' + v[1];
}
