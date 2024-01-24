import React from 'react';
import { formatterEuro } from '../../utils/formatEur';

const BookingTable  = ({ bookingStates }) => {

  function formatDateAndTime(inputDate) {
    const timestamp = inputDate instanceof Date
      ? inputDate
      : new Date(inputDate.seconds * 1000 + (inputDate.nanoseconds || 0) / 1e6);
  
    const date = timestamp.toLocaleDateString();
    const time = timestamp.toLocaleTimeString();
    return date;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full bg-white border border-gray-300 shadow-lg rounded-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Start Date</th>
            <th className="py-2 px-4 border-b">End Date</th>
            <th className="py-2 px-4 border-b">Number of Guests</th>
            <th className="py-2 px-4 border-b">Number of Bags</th>
            <th className="py-2 px-4 border-b">Number of Mini Bags</th>
            <th className="py-2 px-4 border-b">Number of Bikes</th>
            <th className="py-2 px-4 border-b">Baby Chair</th>
            <th className="py-2 px-4 border-b">Price</th>
       {/*      <th className="py-2 px-4 border-b">Payment ID</th> */}
            <th className="py-2 px-4 border-b">Pago total</th>
            <th className="py-2 px-4 border-b">Pago confirmado</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Document Type</th>
            <th className="py-2 px-4 border-b">Document</th>
            <th className="py-2 px-4 border-b">Comments</th>
            <th className="py-2 px-4 border-b">Terms and Conditions</th>
          </tr>
        </thead>
        <tbody>
          {bookingStates.map((bookingState, index) => (
            <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : ''}>
              <td className="py-2 px-4 border-b">{formatDateAndTime(bookingState.startDate)}</td>
              <td className="py-2 px-4 border-b">{formatDateAndTime(bookingState.endDate)}</td>
              <td className="py-2 px-4 border-b">{bookingState.numOfGuests}</td>
              <td className="py-2 px-4 border-b">{bookingState.numOfBags}</td>
              <td className="py-2 px-4 border-b">{bookingState.numOfMiniBags}</td>
              <td className="py-2 px-4 border-b">{bookingState.numOfBikes}</td>
              <td className="py-2 px-4 border-b">{bookingState.babyChair ? 'SÍ' : 'NO'}</td>
              <td className="py-2 px-4 border-b">{formatterEuro.format(bookingState.price)}</td>
             {/*  <td className="py-2 px-4 border-b">{bookingState.payment.paymentID}</td> */}
              <td className="py-2 px-4 border-b">{bookingState.payment.fullPayment ? 'SÍ' : 'NO'}</td>
              <td className="py-2 px-4 border-b">{bookingState.payment.confirmed ? 'SÍ' : 'NO'}</td>
              <td className="py-2 px-4 border-b">{bookingState.name}</td>
              <td className="py-2 px-4 border-b">{bookingState.email}</td>
              <td className="py-2 px-4 border-b">{bookingState.phone}</td>
              <td className="py-2 px-4 border-b">{bookingState.documentType}</td>
              <td className="py-2 px-4 border-b">{bookingState.document}</td>
              <td className="py-2 px-4 border-b">{bookingState.comments}</td>
              <td className="py-2 px-4 border-b">{bookingState.termsAndConditions ? 'SÍ' : 'NO'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
