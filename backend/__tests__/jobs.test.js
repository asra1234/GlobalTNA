jest.mock('../models/JobRequest', () => ({
  find: jest.fn(),
}));

const request = require('supertest');

const JobRequest = require('../models/JobRequest');
const createApp = require('../app');

describe('jobs endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/jobs returns 400 for an invalid category filter', async () => {
    const app = createApp();

    const response = await request(app).get('/api/jobs?category=Invalid');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Invalid category. Must be one of: Plumbing, Electrical, Painting, Joinery, Other',
    });
    expect(JobRequest.find).not.toHaveBeenCalled();
  });

  test('GET /api/jobs returns jobs from the filtered query', async () => {
    const app = createApp();
    const jobs = [{ _id: 'job-1', title: 'Leaking tap', category: 'Plumbing', status: 'Open' }];
    const sort = jest.fn().mockResolvedValue(jobs);

    JobRequest.find.mockReturnValue({ sort });

    const response = await request(app).get('/api/jobs?category=Plumbing&status=Open&q=tap');

    expect(response.status).toBe(200);
    expect(JobRequest.find).toHaveBeenCalledWith({
      category: 'Plumbing',
      status: 'Open',
      $or: [
        { title: /tap/i },
        { description: /tap/i },
      ],
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(response.body).toEqual(jobs);
  });

  test('POST /api/jobs requires authentication', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/api/jobs')
      .send({ title: 'Leaking tap', description: 'Needs repair' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Authentication required' });
  });
});