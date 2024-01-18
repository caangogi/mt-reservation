import React from 'react';
import { RoadMapProps } from '../../backend/road-map/domain/types';
import { InvoiceTemplate } from '../templates/InvoiceTemplate';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface RoadmapTableProps {
  roadmaps: RoadMapProps[];
}

const RoadmapTable: React.FC<RoadmapTableProps> = ({ roadmaps }) => {

   /*  const generatePDF = async (roadMapProps: RoadMapProps) => {
        const invoiceTemplate = InvoiceTemplate(roadMapProps);
      
        try {
          const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
          const margin = 20;
      
          const contentDiv = document.createElement('div');
          contentDiv.innerHTML = invoiceTemplate;
          document.body.appendChild(contentDiv);
      
          const canvas = await html2canvas(contentDiv, { scale: 1 });
      
          doc.addImage(canvas.toDataURL(), 'JPEG', margin, margin, canvas.width * 0.75, canvas.height * 0.75);
      
          doc.setProperties({
            title: 'Factura simplificada',
            subject: 'Prestación de servicio',
            author: 'Transfer',
            keywords: 'generated, javascript, web 2.0, ajax',
            creator: 'C4F',
          });
      
          const pdfBlob = doc.output('blob');
          const file = new File([pdfBlob], 'factura-simplificada.pdf', {
            type: 'application/pdf',
          });
      
          const url = URL.createObjectURL(file);
          window.open(url);
      
          document.body.removeChild(contentDiv);
        } catch (error) {
          console.error('Error al generar el PDF:', error);
        }
      }; */

     
      const generatePDF = async (roadMapProps: RoadMapProps) => {
        try {
           
          const invoiceTemplate = InvoiceTemplate(roadMapProps);
      
          // Crear un elemento div temporal
          const tempDiv = document.createElement('div');
          // Establecer el HTML del div con tu plantilla
          tempDiv.innerHTML = invoiceTemplate;
      
          // Esperar a que el elemento se haya agregado al DOM
          document.body.appendChild(tempDiv);
      
          // Esperar a que el navegador tenga tiempo de renderizar el contenido
          await new Promise(resolve => setTimeout(resolve, 500));
      
          try {
            // Obtener el elemento canvas de HTML2Canvas con una escala específica
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                logging: true, // Puedes activar el logging para ver si hay algún error relacionado con las imágenes.
                imageTimeout: 5000, // Establece un tiempo de espera suficiente para la carga de imágenes (en milisegundos).
              });
      
            // Crear un nuevo documento PDF
            const pdf = new jsPDF({
              orientation: 'p',
              unit: 'mm',
              format: 'a4',
            });
      
            // Ajustar el tamaño del PDF según el tamaño del canvas
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
            // Agregar la imagen generada al PDF
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
      
            // Obtener el blob del PDF
            const pdfBlob = pdf.output('blob');
      
            // Crear un archivo desde el blob
            const file = new File([pdfBlob], 'signed-contract.pdf', {
              type: 'application/pdf',
            });
      
            // Crear una URL para abrir el archivo en una nueva ventana
            const url = URL.createObjectURL(file);
      
            // Abrir la ventana del navegador con el PDF
            window.open(url);
          } catch (error) {
            console.error('Error al generar el PDF con html2canvas:', error);
          } finally {
            // Eliminar el elemento div del DOM después de haber terminado
            document.body.removeChild(tempDiv);
          }
        } catch (error) {
          console.error('Error al generar el PDF:', error);
          // Manejar el error de alguna manera
        }
      };
      
      
      
   
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-start">Factura</th>
            <th className="py-2 px-4 border-b text-start">Nombre</th>
            <th className="py-2 px-4 border-b text-start">Fecha</th>
            <th className="py-2 px-4 border-b text-start">Hora</th>
            <th className="py-2 px-4 border-b text-start">Origen</th>
            <th className="py-2 px-4 border-b text-start">Destino</th>
            <th className="py-2 px-4 border-b text-start">Servicio</th>
            <th className="py-2 px-4 border-b text-start">Pasajeros</th>
            <th className="py-2 px-4 border-b text-start">Precio</th>
            <th className="py-2 px-4 border-b text-start">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roadmaps.map((roadmap) => {

            const timestamp = roadmap.date instanceof Date
            ? roadmap.date
            : new Date(roadmap.date.seconds * 1000 + (roadmap.date.nanoseconds || 0) / 1e6);

            const date = timestamp.toLocaleDateString();
            const time = timestamp.toLocaleTimeString();
            
            return(
            <tr key={roadmap.id}>
              <td className="py-2 px-4 border-b text-start">{roadmap.invoiceNumber}</td>
              <td className="py-2 px-4 border-b text-start">{`${roadmap.client.name} ${roadmap.client.lastName}`}</td>
              <td className="py-2 px-4 border-b text-start">{date}</td>
              <td className="py-2 px-4 border-b text-start">{time}</td>
              <td className="py-2 px-4 border-b text-start">{roadmap.origin}</td>
              <td className="py-2 px-4 border-b text-start">{roadmap.destination}</td>
              <td className="py-2 px-4 border-b text-start">{roadmap.serviceType}</td>
              <td className="py-2 px-4 border-b text-start">{roadmap.passengers}</td>
              <td className="py-2 px-4 border-b text-start">{roadmap.price}€</td>
              <td className="py-2 px-4 border-b text-start">
              <button
                    className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md w-fit"
                    onClick={async () => await generatePDF( roadmap )}
                >
                    Facturar
                </button>
              </td>
            </tr>
            )
          } )}
        </tbody>
      </table>
    </div>
  );
};

export default RoadmapTable;
