import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { prisma } from '../index';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Login route
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    if (!user) {
      return res.status(401).json({ error: info.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login error' });
      }
      return res.json({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login error after registration' });
      }
      return res.json({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Guest login route
router.get('/guest', async (req: Request, res: Response) => {
  try {
    const guestEmail = `guest_${nanoid()}@guest.local`;

    // Create guest user
    const user = await prisma.user.create({
      data: {
        email: guestEmail,
        password: null,
      },
    });

    // Log the guest in
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Guest login error' });
      }
      
      const redirectUrl = req.query.redirectUrl as string || '/';
      return res.redirect(redirectUrl);
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ error: 'Guest login failed' });
  }
});

// Logout route
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

export default router;
