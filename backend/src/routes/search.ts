import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { mobileSearchSchema, vehicleSearchSchema } from '../utils/validation';
import { MobileLookupAPI, VehicleLookupAPI } from '../utils/apiClients';
import { prisma } from '../index';

const router = Router();

router.post('/mobile', authenticate, async (req: AuthRequest, res: Response) => {
  const validation = mobileSearchSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  const { number } = validation.data;
  const result = await MobileLookupAPI.lookup(number);

  if (!result || !result.data) {
    return res.status(404).json({ error: 'No data found for this mobile number' });
  }

  // Save to database
  await prisma.search.create({
    data: {
      userId: req.user!.id,
      type: 'mobile',
      query: number,
      result: result.data,
      source: result.source,
    },
  });

  res.json(result.data);
});

router.post('/vehicle', authenticate, async (req: AuthRequest, res: Response) => {
  const validation = vehicleSearchSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  const { number } = validation.data;
  const result = await VehicleLookupAPI.lookup(number);

  if (!result || !result.data) {
    return res.status(404).json({ error: 'No data found for this vehicle number' });
  }

  await prisma.search.create({
    data: {
      userId: req.user!.id,
      type: 'vehicle',
      query: number,
      result: result.data,
      source: result.source,
    },
  });

  res.json(result.data);
});

router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [searches, total] = await Promise.all([
    prisma.search.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.search.count({ where: { userId: req.user!.id } }),
  ]);

  res.json({
    data: searches,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

router.get('/analytics', authenticate, async (req: AuthRequest, res: Response) => {
  const searches = await prisma.search.findMany({
    where: { userId: req.user!.id },
    select: { type: true, createdAt: true },
  });

  const mobileCount = searches.filter(s => s.type === 'mobile').length;
  const vehicleCount = searches.filter(s => s.type === 'vehicle').length;
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyStats = last7Days.map(date => ({
    date,
    count: searches.filter(s => s.createdAt.toISOString().split('T')[0] === date).length,
  }));

  res.json({
    totalSearches: searches.length,
    mobileSearches: mobileCount,
    vehicleSearches: vehicleCount,
    dailyStats,
  });
});

export default router;
