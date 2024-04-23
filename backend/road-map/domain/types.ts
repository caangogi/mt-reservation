import { User, Timestamp } from "../../share/types";

export type RoadMapProps = {
    id?: string; 
    client: User;
    date: Date | Timestamp; 
    origin: string; 
    destination: string;
    contractedService: string;
    serviceType: string;
    passengers: number;
    price: number;
    driverId?: string;
    invoiceNumber: string;
    invoiceUrl: string;
    paymentMethod: string;
    observations: string;
    vehicle: string;
}
