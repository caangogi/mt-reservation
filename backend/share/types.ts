type UserType = 'driver' | 'guest' | 'admin';

export type User = {
    uid?: string;
    name: string;
    lastName: string;
    documentType: string;
    documentID: string;
    address?: string;
    phone: string;
    email: string;
    type: UserType;
};

export type Timestamp = {
    seconds: number;
    nanoseconds: number;
};


export type BookingState = {
    startDate: Date;
    endDate: Date;
    numOfGuests: number;
    numOfBags: number;
    numOfMiniBags: number;
    numOfBikes: number;
    babyChair: boolean;
    price: number;
    payment: {
      paymentID: string;
      fullPayment: boolean;
      confirmed: boolean;
    };
    name: string;
    email: string;
    phone: string;
    documentType: string;
    document: string;
    comments: string;
    termsAndConditions: boolean;
  };