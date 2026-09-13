const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60),
    email: z.string().trim().email().max(255),
    password: z.string().min(1, 'Password is required').max(128),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1, 'Password is required'),
  }),
});

module.exports = { registerSchema, loginSchema };