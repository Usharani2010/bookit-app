import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import { experienceAPI } from '../services/api';
import type { ExperienceWithSlots, Slot } from '../types/experience';

const ExperienceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [seats, setSeats] = useState(1);
  const [data, setData] = useState<ExperienceWithSlots | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await experienceAPI.getById(id);
        setData(response.data);
        
        // Set first date as default selected
        if (response.data.slots.length > 0) {
          const firstDate = response.data.slots[0].date;
          setSelectedDate(firstDate);
        }
      } catch (err) {
        setError('Failed to load experience details');
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  // Get unique dates from slots
  const uniqueDates = data ? [...new Set(data.slots.map(slot => slot.date))] : [];
  
  // Filter slots by selected date
  const filteredSlots = data ? data.slots.filter(slot => slot.date === selectedDate) : [];

  // Format date to display like "Oct 22"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleBookNow = () => {
    if (selectedSlot && data) {
      navigate(`/checkout/${data.experience._id}`, { 
        state: { 
          slotId: selectedSlot._id, 
          seats: seats,
          slot: selectedSlot,
          experience: data.experience
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto px-16 py-8 text-center">
          <div className="text-lg text-gray-600">Loading experience details...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto px-16 py-8 text-center">
          <div className="text-lg text-red-600">{error || 'Experience not found'}</div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { experience } = data;
  const subtotal = experience.price * seats;
  const taxes = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + taxes;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-[1400px] mx-auto px-16 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <span>←</span>
          Back
        </button>

        {/* Main Layout */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Section - Experience Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience Header */}
            <div>
               {/* Smaller Experience Image */}
            <div className="bg-white rounded-2xl overflow-hidden">
             <img
  src={experience.image} // Use the direct image URL from database
  alt={experience.title}
  className="w-full h-64 object-cover rounded-2xl"
  onError={(e) => {
    // Fallback if image fails to load
    e.currentTarget.src = 'https://images.unsplash.com/photo-1526481280698-716f9c0f0d7d?auto=format&fit=crop&w=500&q=60';
  }}
/>
            </div>
              <h1 className="text-3xl font-bold text-gray-900 mb- p-2">{experience.title}</h1>
              <p className="text-gray-700 text-base leading-relaxed">
                {experience.shortDescription}
              </p>
              <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                {experience.description}
              </p>
            </div>


            {/* Choose Date Section */}
            <div className="bg-white rounded-2xl p-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose date</h2>
              <div className="flex flex-wrap gap-3">
                {uniqueDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-6 py-3 rounded-lg border-2 transition-all min-w-[100px] text-center ${
                      selectedDate === date
                        ? 'border-[#FFD247] bg-[#FFD247]/10 text-gray-900 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Time Section - Horizontal like dates */}
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose time</h2>
              <div className="flex flex-wrap gap-3">
                {filteredSlots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => slot.availableSeats > 0 && setSelectedSlot(slot)}
                    disabled={slot.availableSeats === 0}
                    className={`px-6 py-3 rounded-lg border-2 transition-all min-w-[120px] text-center ${
                      selectedSlot?._id === slot._id
                        ? 'border-[#FFD247] bg-[#FFD247]/10 text-gray-900 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    } ${
                      slot.availableSeats === 0 
                        ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                        : ''
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-medium">{slot.time}</span>
                      <span className={`text-xs mt-1 ${
                        slot.availableSeats === 0 
                          ? 'text-red-600 font-semibold' 
                          : 'text-gray-500'
                      }`}>
                        {slot.availableSeats === 0 
                          ? 'Sold out' 
                          : `${slot.availableSeats} left`
                        }
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {experience.includes.join(', ')}. Minimum age 10.
              </p>
            </div>
          </div>

          {/* Right Section - Booking Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gray-200 rounded-2xl shadow-lg border border-gray-100 p-6">              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Starts at</span>
                  <span className="font-semibold">₹{experience.price}</span>
                </div>
                
                <div>
                  <span className="text-gray-700 block mb-2">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSeats(Math.max(1, seats - 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">{seats}</span>
                    <button 
                      onClick={() => setSeats(seats + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-semibold">₹{taxes}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBookNow}
                disabled={!selectedSlot}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  selectedSlot 
                    ? 'bg-[#FFD247] hover:bg-[#FFD247]/90 text-gray-900 shadow-sm hover:shadow-md' 
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                {selectedSlot ? 'Confirm' : 'Select Time Slot'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;