// useInvoice.ts
import { useProfile } from '../../context/ProfileContext';
import {generateInvoicePDF} from '../../utils/generateInvoicePdf';
import { InvoiceTemplate } from '../templates/InvoiceTemplate';
import toast from 'react-hot-toast';

export const useInvoice = () => {
  const { getUserData } = useProfile();

  const handleUserProfile = async (driverId: string) => {
    const userPromise = getUserData(driverId);
    if(userPromise) {
      return userPromise;
    } else {
      return null;
    }
  }

  const generateInvoice = async (roadmap: any) => { // Reemplaza 'any' con el tipo correcto para 'roadmap'
    if(!roadmap.driverId) return toast.error('No se ha asignado un conductor a esta hoja de ruta');
    const user = await handleUserProfile(roadmap.driverId);
    if(user) {
      const invoiceTemplate = InvoiceTemplate(roadmap, user);
      generateInvoicePDF(invoiceTemplate);
    } else {
      toast.error('No se ha podido generar la factura, intentalo nuevamente');
    }
  }

  return { generateInvoice };
}