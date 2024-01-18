import { User, Timestamp } from "../../share/types";

export type RoadMapProps = {
    id?: string; 
    client: User;
    date: Date | Timestamp; 
    origin: string; 
    destination: string;
    serviceType: string;
    passengers: number;
    price: number;
    driverId?: string;
    invoiceNumber: string;
}
