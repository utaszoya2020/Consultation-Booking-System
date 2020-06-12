const BASE_URL =
process.env.NODE_ENV === 'production' ? 'http://bookingappapi-env.eba-b77icp2s.ap-southeast-2.elasticbeanstalk.com/api/' : 'http://localhost:4000/api';

export default BASE_URL;