export const baseURL = `http://localhost:8000`
    ? import.meta.env.MODE === 'development'
    : `https://www.schedmeet.com`
export const testAuthPath = `${baseURL}/test_auth`
