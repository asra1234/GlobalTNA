const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');
const requireAuth = require('../middleware/requireAuth');

const VALID_CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];
const VALID_STATUSES = ['Open', 'In Progress', 'Closed'];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/jobs — list all jobs; optional ?category=Plumbing&status=Open
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) {
      if (!VALID_CATEGORIES.includes(req.query.category)) {
        return res.status(400).json({ message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
      }
      filter.category = req.query.category;
    }
    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      filter.status = req.query.status;
    }
    if (req.query.q) {
      const keyword = String(req.query.q).trim();
      if (keyword) {
        const pattern = new RegExp(escapeRegex(keyword), 'i');
        filter.$or = [{ title: pattern }, { description: pattern }];
      }
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id — fetch a single job
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs — create a new job
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const job = new JobRequest({ title, description, category, location, contactName, contactEmail });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id — update status only
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status field is required' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id — delete a job
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
