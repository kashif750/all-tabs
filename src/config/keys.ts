const LOCATION = window.location.href;
console.log("Location:: ", LOCATION);

// export const BE_BASE_URL='http://localhost:3310';
export const BE_BASE_URL=LOCATION.includes('localhost') ? "http://localhost:3310" : 'https://tabs-api.haukinnova.com';