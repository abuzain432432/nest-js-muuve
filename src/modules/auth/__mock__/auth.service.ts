const mockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn(),
  completeUserProfileCreatedWithGoogleLogin: jest.fn(),
  generateQrCode: jest.fn(),
  enableTfa: jest.fn(),
  disableTfa: jest.fn(),
  recoverTfa: jest.fn(),
  activateAccount: jest.fn(),
};
export default mockAuthService;
