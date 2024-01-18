import { doc, updateDoc, getFirestore, runTransaction } from 'firebase/firestore';

// Función para generar un nuevo número de factura
export default async function generateInvoiceNumber(): Promise<{ invoiceNumber: string; newCount: number }> {
  const firestore = getFirestore();
  const autoincrementDocRef = doc(firestore, 'autoincrement', 'invoice');
  try {
    const result = await runTransaction(firestore, async (transaction) => {
      const autoincrementSnapshot = await transaction.get(autoincrementDocRef);
      let currentCount = autoincrementSnapshot.exists() ? autoincrementSnapshot.data().count : 0;
      currentCount++;
      transaction.update(autoincrementDocRef, { count: currentCount });
      return currentCount;
    });

    const formattedInvoiceNumber = `INV-${result.toString().padStart(4, '0')}`;
    return { invoiceNumber: formattedInvoiceNumber, newCount: result };
  } catch (error) {
    console.error('Error al generar el número de factura:', error);
    throw error;
  }
}
