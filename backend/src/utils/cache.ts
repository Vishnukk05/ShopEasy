import NodeCache from 'node-cache';

// stdTTL is the default time to live in seconds (60 seconds)
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export default cache;

