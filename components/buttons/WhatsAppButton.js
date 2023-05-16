import React from 'react';
import { RiWhatsappLine } from 'react-icons/ri'
import styles from './buttons.module.scss';

function WhatsAppButton() {
  return (
    <div className={styles.whatsapp_button_container}> 
        <div className={styles.whatsapp_button_content}>
          <a 
            href={`https://wa.me/34671741577?text=Hola`}
            target="_blank"
            rel="noreferrer" 
          > 
            <RiWhatsappLine className={`${styles.arrow_icon} ${styles.arrow_icon_whatsapp}`} /> 
          </a>
        </div>
    </div>
  )
}

export default WhatsAppButton
