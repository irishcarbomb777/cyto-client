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
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_LUfsCnMVZ",
    APP_CLIENT_ID: "c6empkjgc3upqu029id13b6es",
    IDENTITY_POOL_ID: "us-east-1:a91302e3-4da1-4d14-b64a-e082b70ce545",
  }
};

export default config;