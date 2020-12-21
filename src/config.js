const config = {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "pycyto-imgtestbin",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://tpay52bo3d.execute-api.us-east-1.amazonaws.com/prod",
  }, 
};

export default config;