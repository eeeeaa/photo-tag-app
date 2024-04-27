import styles from "../../styles/common/navbar.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { SlHome } from "react-icons/sl";

NameLogo.propTypes = {
  title: PropTypes.string,
};

NavItem.propTypes = {
  label: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.object,
};

function NameLogo({ title }) {
  return (
    <div className={styles["nav-logo-layout"]}>
      <h1 className={styles["nav-title"]}>{title}</h1>
    </div>
  );
}

function NavItem({ url, label, icon = null }) {
  return (
    <Link to={url} className={styles["nav-item"]}>
      <li className={styles["nav-item"]}>
        {icon}
        {label}
      </li>
    </Link>
  );
}

function MenuSection() {
  return (
    <ul className={styles["nav-menu-list"]}>
      <NavItem url="/" label={"Home"} icon={<SlHome />} />
    </ul>
  );
}

function Menu() {
  return (
    <div className={styles["nav-menu-container"]}>
      <NameLogo title="Scanner" />
      <MenuSection />
    </div>
  );
}

export default function Navbar() {
  return (
    <div className={styles["nav-bar"]}>
      <Menu />
    </div>
  );
}
