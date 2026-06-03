import { Router, Response } from 'express';
import { AuthRequest, authenticate, requireAdmin } from '../middleware/auth';
import { prisma } from '../index';
import bcrypt from 'bcryptjs';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  res.json({
    data: users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

router.get('/users/:userId/searches', async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [searches, total] = await Promise.all([
    prisma.search.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.search.count({ where: { userId } }),
  ]);

  res.json({
    data: searches,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

router.put('/users/:userId/role', async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  });

  res.json(user);
});

router.delete('/users/:userId', async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  await prisma.search.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });

  res.json({ message: 'User deleted successfully' });
});

export default router;
