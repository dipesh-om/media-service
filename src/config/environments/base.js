module.exports = {
  version: 'v1',
  
  AWS_ACCESS_KEY_ID: process.env._AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env._AWS_SECRET_ACCESS_KEY,
  AWS_REGION: 'ap-south-1',

  port: process.env.PORT || 4001,
  timezone: process.env.TIMEZONE,
  
  KAFKA_HOST_IP : process.env.KAFKA_HOST_IP,
  KAFKA_GROUP_ID : process.env.KAFKA_GROUP_ID,
  KAFKA_TOPIC_SUBSCRIBER : process.env.KAFKA_TOPIC_SUBSCRIBER || false,
  
  EXTERNAL_APP_VALIDATE :  process.env.EXTERNAL_APP_VALIDATE || false, 
  EXTERNAL_APP_VERIFIER_PUBLIC_KEY: process.env.EXTERNAL_APP_VERIFIER_PUBLIC_KEY,

  logging: {
    maxsize: 100 * 1024, // 100mb
    maxFiles: 2,
    colorize: false
  },
  
}