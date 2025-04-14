import styles from "./Header.module.scss";
import { HeaderProps } from "../../types/header";
import React from "react";

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
};

export default Header;
