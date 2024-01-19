import React from 'react';
import { RoadMapProps } from '../../backend/road-map/domain/types';
interface RoadmapTableProps {
  roadmaps: RoadMapProps[];
}

const RoadmapTable: React.FC<RoadmapTableProps> = ({ roadmaps }) => {
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
                <a
                    href={roadmap.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <button
                        className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md w-fit"
                    >
                        PDF
                    </button>
                </a>
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
