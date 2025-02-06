import jsPDF from 'jspdf';  
import html2canvas from 'html2canvas';

export const generatePDF = async (template: string) => {
    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template;
        document.body.appendChild(tempDiv);
    
        await new Promise(resolve => setTimeout(resolve, 500));
    
        try {
        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            logging: true, 
            imageTimeout: 5000, 
            });

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });
    
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
    
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], 'signed-contract.pdf', {
            type: 'application/pdf',
        });
        const url = URL.createObjectURL(file);
        
        return { file, url };


        } catch (error) {
        console.error('Error al generar el PDF con html2canvas:', error);
        } finally {
        document.body.removeChild(tempDiv);
        }
    } catch (error) {
        console.error('Error al generar el PDF:', error);
    }
};