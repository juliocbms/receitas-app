import React from "react"

interface MensagemProps{
    mensagem: string;
}

const Mensagem: React.FC<MensagemProps> =(props: any) =>{
return(
    <div>
        {props.mensagem}
    </div>
)
}

function MeuComponente(){
    return(
        <div>
            <Mensagem mensagem="Teste"/>
        </div>
    )
}

export default MeuComponente