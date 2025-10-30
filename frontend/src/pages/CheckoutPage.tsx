import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { bookingAPI } from '../services/api';
const CheckoutPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { slotId, seats, slot } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    promoCode: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Mock experience data
  const experience = {
    id: Number(id),
    title: "Kayaking",
    price: 999,
  };

  const subtotal = experience.price * (seats || 1);
  const taxes = Math.round(subtotal * 0.05); // 5% tax
  const finalAmount = subtotal + taxes - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyPromo = () => {
    if (formData.promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(100);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!agreeToTerms) {
    alert('Please agree to the terms and safety policy');
    return;
  }

  // Check if seats exceed available seats
  if (seats > slot.availableSeats) {
    alert(`Cannot book ${seats} seats. Only ${slot.availableSeats} seats available for this time slot.`);
    return;
  }

  try {
    // Generate fake reference ID
    const referenceId = 'BK' + Date.now();
    
    // Call backend API to update slot availability
    const bookingData = {
      experienceId: id,
      slotId: slotId,
      customerName: formData.firstName,
      customerEmail: formData.email,
      customerPhone: "1234567890",
      seatsBooked: seats,
      promoCode: formData.promoCode || ''
    };

    // This will create booking AND update slot seats in database
    const response = await bookingAPI.create(bookingData);
    
    // Redirect to confirmation
    navigate('/confirmation', { 
      state: { 
        referenceId: referenceId,
        experience: experience,
        seats: seats,
        slot: slot,
        finalAmount: finalAmount
      } 
    });

  } catch (error: any) {
    console.error('Booking error:', error);
    
    if (error.response?.data?.error) {
      alert('Booking failed: ' + error.response.data.error);
    } else {
      alert('Booking failed. Please try again.');
    }
  }
};

  if (!slotId) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1280px] mx-auto px-6 py-8 text-center">
          <p>Please select a time slot first.</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 mt-4">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 text-lg"
        >
          ← Checkout
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Checkout Form */}
          <div>
           
            
            <form onSubmit={handleSubmit} className="w-full px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg space-y-8">
              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border  bg-gray-200 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-base"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border  bg-gray-200 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-base"
                    placeholder="Your email"
                  />
                </div>
              </div>


              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Promo code
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border  bg-gray-200 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-base"
                    placeholder="Enter promo code"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-8 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 text-base min-w-[120px]"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 focus:ring-black"
                />
                <label htmlFor="terms" className="text-gray-700 text-base leading-relaxed">
                  I agree to the terms and safety policy
                </label>
              </div>

              {/* Pay Button */}
             
            </form>
          </div>

          {/* Right Section - Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 h-fit border border-gray-200">            
            <div className="space-y-2">
              {/* Experience Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold text-gray-900">{experience.title}</span>
                </div>
                
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">{slot?.date}</span>
                </div>
                
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">{slot?.time}</span>
                </div>
                
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Qty</span>
                  <span className="font-semibold text-gray-900">{seats || 1}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-300 pt-6 space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold text-gray-900">₹{taxes}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-base text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between text-base font-bold pt-6 border-t border-gray-300">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{finalAmount}</span>
                </div>
                 <button
  onClick={handleSubmit} // Add this
  disabled={!agreeToTerms}
  className={`w-full py-3 rounded-lg font-semibold text-base transition-all ${
    agreeToTerms 
      ? 'bg-[#FFD247] text-black hover:bg-gray-500' 
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  Pay and Confirm
</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;