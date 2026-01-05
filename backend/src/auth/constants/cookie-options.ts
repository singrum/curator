export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  domain: `.${new URL(process.env.CLIENT_URL || 'http://localhost:3000').hostname}`,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
