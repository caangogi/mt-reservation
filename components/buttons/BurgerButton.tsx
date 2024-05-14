import  { useState } from 'react';
import styles from "../../styles/BurgerButton.module.scss";

const BurgerButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={isOpen ? `${styles.menuBars} ${styles.open}` : styles.menuBars}
            onClick={open}
        >
            <div className={styles.btnBurger}></div>
        </div>
    );
};

export default BurgerButton;