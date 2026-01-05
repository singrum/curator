export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  domain: `.${process.env.CLIENT_URL}`,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
