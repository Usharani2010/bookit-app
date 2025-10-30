import express from 'express';

const router = express.Router();

// POST /api/promo/validate - Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { promoCode, totalAmount } = req.body;

    if (!promoCode || !totalAmount) {
      return res.status(400).json({ error: 'Promo code and total amount are required' });
    }

    // Define valid promo codes
    const validPromos = {
      'SAVE10': {
        type: 'fixed',
        value: 100,
        minAmount: 500,
        message: '₹100 off on orders above ₹500'
      },
      'WELCOME20': {
        type: 'percentage',
        value: 20,
        minAmount: 1000,
        message: '20% off on orders above ₹1000'
      },
      'FLAT50': {
        type: 'fixed',
        value: 50,
        minAmount: 300,
        message: '₹50 off on orders above ₹300'
      }
    };

    const promo = validPromos[promoCode.toUpperCase()];

    if (!promo) {
      return res.json({
        valid: false,
        message: 'Invalid promo code'
      });
    }

    if (totalAmount < promo.minAmount) {
      return res.json({
        valid: false,
        message: `Minimum order amount of ₹${promo.minAmount} required`
      });
    }

    let discount = 0;
    if (promo.type === 'percentage') {
      discount = Math.round((totalAmount * promo.value) / 100);
    } else {
      discount = promo.value;
    }

    const finalAmount = totalAmount - discount;

    res.json({
      valid: true,
      discount,
      finalAmount,
      message: promo.message
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;