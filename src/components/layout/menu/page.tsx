import React from "react";
import Link from "next/link";


export const Menu: React.FC = () => {
    return (
        <aside className="menu column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
            <p className="menu-label is-hidden-touch">Geral</p>
            <ul className="menu-list">
            <li><a href=" ">Home</a></li>
            <li><a href="/cadastros/receitas">Lançamentos</a></li>
            <li><a>Orçamentos</a></li>
            <li><a>Investimentos</a></li>
            </ul>
        </aside>
    )
}

interface MenuItemProps {
    href: string,
    label: string
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
    return (
        <li>
            <Link href={props.href}>
                <span className="icon"></span> {props.label}
            </Link>

        </li>
    )
}