import express from 'express';
import Booking from '../models/Booking.js';
import Experience from '../models/Experience.js';
import Slot from '../models/Slot.js';

const router = express.Router();

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
  try {
    const {
      experienceId,
      slotId,
      customerName,
      customerEmail,
      customerPhone,
      seatsBooked,
      promoCode
    } = req.body;

    // Validate required fields
    if (!experienceId || !slotId || !customerName || !customerEmail || !customerPhone || !seatsBooked) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if slot exists and has enough seats
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Time slot not found' });
    }

    if (slot.availableSeats < seatsBooked) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Get experience details for pricing
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Calculate amounts
    const subtotal = experience.price * seatsBooked;
    const taxes = Math.round(subtotal * 0.05); // 5% tax
    let discount = 0;

    // Apply promo code discount if valid
    if (promoCode) {
      const validPromos = {
        'SAVE10': 100,
        'WELCOME20': 200,
        'FLAT50': 50
      };
      
      if (validPromos[promoCode.toUpperCase()]) {
        discount = validPromos[promoCode.toUpperCase()];
      }
    }

    const finalAmount = subtotal + taxes - discount;

    // Generate unique reference ID
    const referenceId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create booking
    const booking = new Booking({
      referenceId,
      experienceId,
      slotId,
      customerName,
      customerEmail,
      customerPhone,
      seatsBooked,
      totalAmount: subtotal + taxes,
      promoCode: promoCode || '',
      discount,
      finalAmount
    });

    await booking.save();

    // ✅ UPDATE SLOT AVAILABILITY - Reduce available seats
    slot.availableSeats -= seatsBooked;
    await slot.save();

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: {
        referenceId: booking.referenceId,
        experience: experience.title,
        date: slot.date,
        time: slot.time,
        seats: booking.seatsBooked,
        totalAmount: booking.finalAmount,
        customerName: booking.customerName
      },
      updatedSlot: { // Return updated slot info
        availableSeats: slot.availableSeats,
        maxSeats: slot.maxSeats
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/:referenceId - Get booking by reference ID
router.get('/:referenceId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ referenceId: req.params.referenceId })
      .populate('experienceId')
      .populate('slotId');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;