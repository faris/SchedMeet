export const baseURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `http://localhost:8000`
    : `https://api.schedmeet.com`;

export const testAuthPath = `${baseURL}/test_auth`;
