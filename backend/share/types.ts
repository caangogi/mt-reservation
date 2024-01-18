type UserType = 'driver' | 'guest' | 'admin';

export type User = {
    uid?: string;
    name: string;
    lastName: string;
    documentType: string;
    documentID: string;
    phone: string;
    type: UserType;
};

export type Timestamp = {
    seconds: number;
    nanoseconds: number;
};