import React from "react";
import Link from "next/link";
import LogOutButton from "@/components/login/logout/page";


export const MenuDois: React.FC = () => {
    return (
        <aside className="menu column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
            <p className="menu-label is-hidden-touch"></p>
            <ul className="menu-list">
            
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