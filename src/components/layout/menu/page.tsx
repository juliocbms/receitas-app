import React from "react";
import Link from "next/link";


export const Menu: React.FC = () => {
    return (
        <aside className="menu column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
            <p className="menu-label">Geral</p>
            <ul className="menu-list">
                <li><a>Dashboard</a></li>
                <li><a>Customers</a></li>
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