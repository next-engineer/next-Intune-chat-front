import { z } from 'zod';

export const signUpResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  token: z.string(),
  createdAt: z.string().optional().default(() => new Date().toISOString()),
});

export type SignUpResponseSchema = z.infer<typeof signUpResponseSchema>;

export const validateSignUpResponse = (data: unknown): SignUpResponseSchema => {
  return signUpResponseSchema.parse(data);
}; 