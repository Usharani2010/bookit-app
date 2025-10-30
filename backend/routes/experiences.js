import express from 'express';
import Experience from '../models/Experience.js';
import Slot from '../models/Slot.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// POST /api/experiences - Create experience (accepts both file upload and image URL)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      price,
      location,
      duration,
      category,
      includes,
      rating,
      reviewCount,
      imageUrl // New field for direct URL
    } = req.body;

    let base64Image, imageFormat;

    if (req.file) {
      // Method 1: File upload -> Convert to Base64
      base64Image = req.file.buffer.toString('base64');
      imageFormat = req.file.mimetype.split('/')[1];
    } else if (imageUrl) {
      // Method 2: Direct URL -> We'll store the URL directly
      // For URL, we'll store it as is and handle display differently
      base64Image = imageUrl; // Actually storing the URL
      imageFormat = 'url'; // Special format to indicate it's a URL
    } else {
      return res.status(400).json({ error: 'Either image file or imageUrl is required' });
    }

    const experience = new Experience({
      title,
      description,
      shortDescription,
      price: parseInt(price),
      location,
      duration,
      category,
      includes: typeof includes === 'string' ? JSON.parse(includes) : includes,
      rating: parseFloat(rating) || 4.5,
      reviewCount: parseInt(reviewCount) || 0,
      image: base64Image,
      imageFormat: imageFormat
    });

    await experience.save();
    
    // Return appropriate image URL based on storage method
    let responseImageUrl;
    if (imageFormat === 'url') {
      responseImageUrl = base64Image; // It's actually the URL
    } else {
      responseImageUrl = `data:image/${imageFormat};base64,${base64Image}`;
    }
    
    const responseExperience = {
      ...experience.toObject(),
      imageUrl: responseImageUrl
    };
    
    res.status(201).json(responseExperience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/experiences - Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    
    // Convert to appropriate URL format
    const experiencesWithDataUrls = experiences.map(exp => {
      let imageUrl;
      if (exp.imageFormat === 'url') {
        imageUrl = exp.image; // It's already a URL
      } else {
        imageUrl = `data:image/${exp.imageFormat};base64,${exp.image}`;
      }
      
      return {
        ...exp.toObject(),
        imageUrl: imageUrl
      };
    });

    res.json(experiencesWithDataUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/experiences/:id - Get single experience with slots
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Get available slots
    const slots = await Slot.find({ 
      experienceId: req.params.id,
      availableSeats: { $gt: 0 }
    }).sort({ date: 1, time: 1 });

    // Convert to appropriate URL format
    let imageUrl;
    if (experience.imageFormat === 'url') {
      imageUrl = experience.image;
    } else {
      imageUrl = `data:image/${experience.imageFormat};base64,${experience.image}`;
    }

    const experienceWithDataUrl = {
      ...experience.toObject(),
      imageUrl: imageUrl
    };

    res.json({
      experience: experienceWithDataUrl,
      slots
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST /api/experiences/:id/slots - Add slots for an experience
router.post('/:id/slots', async (req, res) => {
  try {
    const { dates, times, maxSeats } = req.body;
    const experienceId = req.params.id;

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const slots = [];
    
    for (const date of dates) {
      for (const time of times) {
        slots.push({
          experienceId,
          date,
          time,
          maxSeats: maxSeats || 15,
          availableSeats: maxSeats || 15
        });
      }
    }

    await Slot.insertMany(slots);
    
    res.status(201).json({
      message: 'Slots created successfully',
      slots: slots.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;