const BASE_URL = 
process.env.NODE_ENV === 'production' ? 'http://aibt-env.eba-8j4gbazh.us-east-2.elasticbeanstalk.com/api/' : 'http://localhost:3000/api';

export default BASE_URL;