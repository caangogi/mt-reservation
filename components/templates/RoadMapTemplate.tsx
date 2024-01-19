import { RoadMapProps } from "../../backend/road-map/domain/types"
import { User } from "../../backend/share/types";
import { formatterEuro } from "../../utils/formatEur";

export const RoadMapTemplate = (roadMapProps: RoadMapProps, driver: User) => {

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
                display: block;
                width: 100vw;
                margin: 0 auto;
                height: fit-content;
                padding: 3rem 1.5rem;
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
              border: 1px solid #ddd;
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

            @media (max-width: 600px) {
                main {
                    padding: 1rem;
                }
      
                header {
                    margin-bottom: 5px;
                }
                
                .header-container {
                    margin-top: 5px;
                    gap: 1rem;
                }
            
                .logo-container {
                    max-width: 50px;
                }
            
                .logo-image {
                    width: 100%; 
                }
            
                .header-info-container {
                    display: block;
                    text-align: left;
                }

                .header-info-container p{
                    font-size: .5rem;
                }
    
                .title-container{
                    height: 1rem;
                    margin-bottom: 15px;
                }
                
                .title{
                    font-size: 1rem;
                }
            
               
                .grid-container {
                    margin-bottom: .5rem;
                }

                .grid-item {
                    padding: 5px;
                }
                .grid-item h2 {
                    font-size: .5rem;
                }

              
                table {
                  margin-bottom: 5px;
                }
      
                th, td {
                  padding: 5px;
                  font-size: .7rem;
                }
    
                th{
                    background-color: #e0e0e0;
                }
      
                .client-info {
                  margin-bottom: 10px;
                }

                .client-info h2 {
                  font-size: .7rem;
                }

                .client-info p{
                    font-size: .7rem;
                }
                
                .footer p{
                    font-size: .7rem;
                }


      
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
                        <p>CIF: B44651552</p>
                        <p>Tel: 671 741 577</p>
                        <p>Calle Music Baltasar Samper, 2B 3-1</p>
                        <p>07008 Palma de Mallorca</p>
                        <p>ILLES BALEARS</p>
                        <p>santiagosbus@gmail.com</p>
                    </div>
                </div>
            </header>
            
            <div class="title-container">
                <h1 class="title">HOJA DE RUTA</h1>
            </div>

            <div class="grid-container">
                <div class="grid-item">
                    <h2>Matrícula Vehiculo Renault </h2>
                    <h2> 5817FTT </h2>
                </div>
               
                <div class="grid-item">
                    <h2>Fecha:</h2>
                    <h2> ${date} / ${time}</h2>
                </div>
            </div>

            <div class="client-info">
              <h2><strong>Datos del Cliente</strong></h2>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo de documento</th>
                  <th>Documento</th>
                  <th>Télefono</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${roadMapProps.client.name} ${roadMapProps.client.lastName}</td>
                  <td>${roadMapProps.client.documentType}</td>
                  <td>${roadMapProps.client.documentID}</td>
                  <td>${roadMapProps.client.phone}</td>
                  <td>${roadMapProps.client.email}</td>
                </tr>
               
              </tbody>
            </table>

            <div class="client-info">
              <h2><strong>Datos del Servicio</strong></h2>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Pasajeros</th>
                  <th>Servicio contratado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${roadMapProps.origin}</td>
                  <td>${roadMapProps.destination}</td>
                  <td>${roadMapProps.passengers}</td>
                  <td>${roadMapProps.contractedService}</td>
                </tr>
               
              </tbody>
            </table>

            <div class="client-info">
              <h2><strong>Datos de pago</strong></h2>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Metodo de pago</th>
                  <th>Base imponible</th>
                  <th>10% IVA</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${roadMapProps.paymentMethod}</td>
                  <td>${formatterEuro.format(roadMapProps.price)}</td>
                  <td>${formatterEuro.format(iva)}</td>
                  <td>${formatterEuro.format(total)}</td>
                </tr>
               
              </tbody>
            </table>
  
            <div class="footer">
              <p>Conductor: ${driver.name} ${driver.lastName}</p>
              <p>Documento: ${driver.documentID}</p>
              <p>Teléfono: ${driver.phone}</p>
              <p>Mallorca Transfer 2023 SL</p>
              <p>Gracias por elegir nuestros servicios.</p>
            </div>
          </main>
        </body>
      </html>
    `;
  };
