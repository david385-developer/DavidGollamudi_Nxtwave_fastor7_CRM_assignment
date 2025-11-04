// controllers/enquiryController.js
const { Enquiry } = require('../models');

// Public: Submit enquiry (no auth)
const submitPublicEnquiry = async (req, res) => {
  const { name, email, courseInterest } = req.body;

  if (!name || !email || !courseInterest) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const enquiry = await Enquiry.create({
      name,
      email,
      courseInterest,
      claimed: false,
      counselorId: null,
    });

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Protected: Get all unclaimed (public) enquiries
const getPublicEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({
      where: { claimed: false, counselorId: null },
      attributes: ['id', 'name', 'email', 'courseInterest', 'createdAt'],
    });

    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Protected: Get private enquiries (claimed by logged-in counselor)
const getPrivateEnquiries = async (req, res) => {
  const counselorId = req.user;

  try {
    const enquiries = await Enquiry.findAll({
      where: { counselorId, claimed: true },
      attributes: ['id', 'name', 'email', 'courseInterest', 'createdAt'],
    });

    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Protected: Claim an enquiry
const claimEnquiry = async (req, res) => {
  const enquiryId = req.params.id;
  const counselorId = req.user;

  try {
    const enquiry = await Enquiry.findByPk(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    if (enquiry.claimed === true) {
      return res.status(409).json({ message: 'This lead has already been claimed.' });
    }

    enquiry.claimed = true;
    enquiry.counselorId = counselorId;
    await enquiry.save();

    res.status(200).json({ message: 'Lead claimed successfully', enquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitPublicEnquiry,
  getPublicEnquiries,
  getPrivateEnquiries,
  claimEnquiry,
};