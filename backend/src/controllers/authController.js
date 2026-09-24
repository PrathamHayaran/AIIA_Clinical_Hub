const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { signToken } = require('../config/jwt');

// Helper to generate a unique institutional ID
const generateUniqueId = async (role) => {
  const rolePrefixes = {
    ADMIN: 'ADM',
    RESEARCHER: 'RES',
    SAFETY_OFFICER: 'SAF',
    COMPLIANCE_OFFICER: 'CMP',
    MANAGEMENT: 'MGT',
    PATIENT: 'PAT',
  };

  const prefix = rolePrefixes[role] || 'USR';
  let isUnique = false;
  let uniqueId = '';

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    uniqueId = `AIIA-${prefix}-${randomNum}`;
    const existing = await prisma.user.findUnique({ where: { uniqueId } });
    if (!existing) isUnique = true;
  }

  return uniqueId;
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both institutional email address and password.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or credentials.',
      });
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email });

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! [ID: ${user.uniqueId || 'AIIA-USR-1000'}]`,
      token,
      user: {
        id: user.id,
        uniqueId: user.uniqueId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      department = 'Kayachikitsa (Internal Medicine)',
    } = req.body;
    const role = 'RESEARCHER';

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this institutional email already exists. Please log in.',
      });
    }

    const uniqueId = await generateUniqueId(role);
    const passwordHash = await bcrypt.hash(password, 10);

    const defaultAvatars = {
      ADMIN: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      RESEARCHER: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      SAFETY_OFFICER: 'https://images.unsplash.com/photo-1594824813589-4b71f9f25752?w=150&auto=format&fit=crop&q=80',
      COMPLIANCE_OFFICER: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      MANAGEMENT: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    const newUser = await prisma.user.create({
      data: {
        uniqueId,
        email: email.toLowerCase().trim(),
        password: passwordHash,
        name,
        role,
        department,
        avatar: defaultAvatars[role] || defaultAvatars.RESEARCHER,
      },
    });

    const token = signToken({ userId: newUser.id, role: newUser.role, email: newUser.email });

    res.status(201).json({
      success: true,
      message: `Registration successful! Your Unique Institutional ID is ${uniqueId}`,
      token,
      user: {
        id: newUser.id,
        uniqueId: newUser.uniqueId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        uniqueId: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Demo quick-login helper for seamless hackathon switching
exports.quickDemoLogin = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        message: 'Demo access is disabled in production.',
      });
    }

    const { role } = req.body;
    const targetRole = role ? role.toUpperCase() : 'ADMIN';
    const allowedRoles = ['ADMIN', 'RESEARCHER', 'SAFETY_OFFICER', 'COMPLIANCE_OFFICER', 'MANAGEMENT', 'PATIENT'];

    if (!allowedRoles.includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid demo role.',
      });
    }

    const user = await prisma.user.findFirst({
      where: { role: targetRole },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Demo user for role ${targetRole} not found. Please re-run seed script.`,
      });
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email });

    res.status(200).json({
      success: true,
      message: `Quick-switched to ${user.name} [ID: ${user.uniqueId || 'AIIA-USR-1000'}].`,
      token,
      user: {
        id: user.id,
        uniqueId: user.uniqueId,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { avatar, name, department } = req.body;
    const updateData = {};

    if (avatar !== undefined) updateData.avatar = avatar;
    if (name !== undefined && name.trim() !== '') updateData.name = name.trim();
    if (department !== undefined && department.trim() !== '') updateData.department = department.trim();

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        uniqueId: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatar: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
