import { RoadMapProps } from "../../backend/road-map/domain/types"

export const InvoiceTemplate = (roadMapProps: RoadMapProps) => {

    const timestamp = roadMapProps.date instanceof Date
    ? roadMapProps.date
    : new Date(roadMapProps.date.seconds * 1000 + (roadMapProps.date.nanoseconds || 0) / 1e6);

    const date = timestamp.toLocaleDateString();
    const time = timestamp.toLocaleTimeString();

    const sum = (num1: number, num2:number): number => num1 + num2;
    const iva: number = roadMapProps.price * 0.1;
    const total = sum(Number(roadMapProps.price), Number(iva))

    return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Factura de Servicio</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding-top: 1.5rem;
            }
  
            main {
              max-width: 800px;
              margin: 0 auto;
              min-height: 100vh;
              padding-top: 3rem;
            }
  
            header {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .header-container {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-top: 20px;
                gap: 1rem;
            }
        
            .logo-container {
                display: flex;
                max-width: 150px;
            }

        
            .logo-image {
                width: 100px; 
                height: auto;
            }
        
            .header-info-container {
                display: block;
                text-align: left;
            }


            .title-container{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 3rem;
                margin-bottom: 1rem;
            }
            
            .title{
                font-size: 1.5rem;
                font-weight: bold;
                text-align: center;
            }
        
            h2{
                font-size: 1.2rem;
            }

            .grid-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr); 
                gap: 1rem; 
                margin-bottom: 1rem;
            }
            
            .grid-item {
                background-color: #e0e0e0;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
  
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
  
            th, td {
              padding: 10px;
              text-align: left;
              border-left: 2px solid #ddd;
            }

            th{
                background-color: #e0e0e0;
            }
  
            .client-info {
              margin-bottom: 20px;
            }
  
            .footer {
              text-align: center;
              margin-top: 20px;
              background-color: #e0e0e0;
              padding: 2rem;
            }
          </style>
        </head>
        <body>
          <main>
            <header>
               
                <div class="header-container">
                    <div class="logo-container">
                        <img 
                            src="/logo_02.png"
                            alt="Logo"
                        />
                    </div>
                    <div class="header-info-container">
                        <p>CIF: B1663564</p>
                        <p>634683714</p>
                        <p>Miguel Angel Riera 48</p>
                        <p>07004 Palma de Mallorca</p>
                        <p>ILLES BALEARS</p>
                        <p>info@mrjhonytransfer.com</p>
                    </div>
                </div>
            </header>
            
            <div class="title-container">
                <h1 class="title">FACTURA SIMPLIFICADA</h1>
            </div>

            <div class="grid-container">
                <div class="grid-item">
                    <h2>Nº Factura: </h2>
                    <h2> ${roadMapProps.invoiceNumber} </h2>
                </div>
               
                <div class="grid-item">
                    <h2>Fecha Factura:</h2>
                    <h2> ${date} / ${time}</h2>
                </div>
            </div>

            <div class="client-info">
              <h2><strong>Datos del Cliente</strong></h2>
              <br/>
              <p><strong>Nombre:</strong> ${roadMapProps.client.name} ${roadMapProps.client.lastName}</p>
              <p><strong>Tipo de Documento:</strong> ${roadMapProps.client.documentType}</p>
              <p><strong>Número de Documento:</strong> ${roadMapProps.client.documentID}</p>
              <p><strong>Teléfono:</strong> ${roadMapProps.client.phone}</p>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Pasajeros</th>
                  <th>Base imponible</th>
                  <th>10% IVA</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${roadMapProps.origin}</td>
                  <td>${roadMapProps.destination}</td>
                  <td>${roadMapProps.passengers}</td>
                  <td>${roadMapProps.price}€</td>
                  <td>${iva}€</td>
                  <td>${total}€</td>
                </tr>
               
              </tbody>
            </table>
  
            <div class="footer">
              <p>El pago de la factura realizar a Nº CTA: ES70 2100 0196 2002 0059 3267</p>
              <p>Mallorca Transfer</p>
              <p>Gracias por elegir nuestros servicios.</p>
            </div>
          </main>
        </body>
      </html>
    `;
  };
