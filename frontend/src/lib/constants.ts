// Simple password generation for guest users
const generateDummyPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 32; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const isProductionEnvironment = import.meta.env.MODE === "production";
export const isDevelopmentEnvironment = import.meta.env.MODE === "development";
export const isTestEnvironment = Boolean(
  import.meta.env.VITE_PLAYWRIGHT_TEST_BASE_URL ||
    import.meta.env.VITE_PLAYWRIGHT ||
    import.meta.env.VITE_CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();
