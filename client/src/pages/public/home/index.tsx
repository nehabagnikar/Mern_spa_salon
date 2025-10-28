
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import React from 'react';

function Homepage() {
  return (
    <div className='flex flex-col'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-center bg-primary text-white px-6 md:px-20 py-4 md:py-6 gap-4 md:gap-0'>
        <h1 className='text-2xl font-bold text-white'>Bare Bliss</h1>
        <Link to="/login">
          <Button variant="outline" className="text-primary bg-white hover:bg-gray-100">
            Login
          </Button>
        </Link>
      </div>

      {/* Main Content Section with Image */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[80vh] items-center px-6 md:px-20 py-10'>
        {/* Left Text Section */}
        <div className='flex flex-col gap-4 text-center md:text-left'>
          <h1 className='text-2xl md:text-3xl font-bold text-primary'>
            Welcome to the Bare Bliss Salon-Spa
          </h1>
          <p className='text-gray-700 text-sm md:text-base font-semibold'>
            Bare Bliss Salon-Spa is a platform that connects barbers with customers. It helps customers find barbers near them and book appointments.
          </p>
          <div className='flex justify-center md:justify-start'>
            <Button className='w-max'>Get started</Button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className='flex justify-center'>
          <img 
            src="/images/barber.webp"  // ✅ Correct path if image is in public folder
            alt="Salon interior or experience" 
            className="w-full max-w-[300px] md:max-w-[400px] rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
