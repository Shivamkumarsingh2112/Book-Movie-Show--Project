import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from './Title';
import dateFormat from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken, user } = useAppContext()

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      setBookings(data.bookings || []); // 🔹 FIX: default empty array
    } catch (error) {
      console.error(error);
      setBookings([]); // 🔹 FIX: ensure bookings is always an array
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className='max-w-6xl mt-6 overflow-x-auto'>
        <table className='w-60 gap-6 border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-2xl text-white'>
              <th className='p-2 font-medium pl-8 '>User Name</th>
              <th className='p-2 font-medium'>Movie Name</th>
              <th className='p-2 font-medium '>Show Time</th>
              <th className='p-2 font-medium'>Seats</th>
              <th className='p-2 font-medium'>Amount</th>
            </tr>
          </thead>

          <tbody className='text-2xl font-light'>
            {bookings.map((item, index) => (
              <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                
                {/* 🔹 FIX: optional chaining and fallback */}
                <td className='p-2 min-w-45 pl-5'>{item.user?.name || "Unknown User"}</td>
                
                {/* 🔹 FIX: optional chaining and fallback */}
                <td className='p-2'>{item.show?.movie?.title || "Unknown Movie"}</td>
                
                {/* 🔹 FIX: check for null showDateTime */}
                <td className='p-2'>{item.show?.showDateTime ? dateFormat(item.show.showDateTime) : "N/A"}</td>
                
                {/* 🔹 FIX: check bookedSeats is not null */}
                <td className='p-2'>
                  {item.bookedSeats
                    ? Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")
                    : "No Seats"}
                </td>
                
                {/* 🔹 FIX: default amount to 0 if null */}
                <td className='p-2'>{currency} {item.amount || 0}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListBookings
