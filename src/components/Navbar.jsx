import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/products", label: "Products" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/sales", label: "Sales" },
  { to: "/purchases", label: "Purchases" },
  { to: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="branding" aria-label="Island Brew Lanka brand">
          <div className="brand-mark">IBL</div>
          <span>
            Island Brew Lanka
            <small>coffee inventory studio</small>
          </span>
          {/* ☕️ Animated coffee steam placeholder */}
        </div>
        <div className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
