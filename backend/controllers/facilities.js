const Facility = require("../models/Facility");
const Booking = require("../models/Booking");

const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

exports.getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    next(error);
  }
};

exports.getFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findOne({ _id: req.params.id, isActive: true });
    if (!facility) return res.status(404).json({ success: false, error: "Facility not found" });
    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

exports.createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

exports.updateFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );
    if (!facility) return res.status(404).json({ success: false, error: "Facility not found" });
    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

exports.deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!facility) return res.status(404).json({ success: false, error: "Facility not found" });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.getFacilityAvailability = async (req, res, next) => {
  try {
    const { date, exclude } = req.query;
    const bookings = await Booking.find({
      facility: req.params.id,
      bookingDate: new Date(`${date}T00:00:00.000Z`),
      ...(exclude && { _id: { $ne: exclude } }),
    }).sort({ startMinutes: 1 });

    const data = bookings.map((b) => ({
      startTime: toTime(b.startMinutes),
      endTime: toTime(b.endMinutes),
      startMinutes: b.startMinutes,
      endMinutes: b.endMinutes,
    }));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};
