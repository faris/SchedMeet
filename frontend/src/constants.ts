export const baseURL =
    import.meta.env.MODE === 'development'
        ? `http://localhost:8000`
        : `https://api.schedmeet.com`
export const testAuthPath = `${baseURL}/test_auth`
