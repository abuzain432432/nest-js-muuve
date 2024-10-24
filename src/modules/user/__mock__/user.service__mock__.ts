const UserService__mock__ = {
  findOneByOtp: jest.fn(),
  saveTfaSecret: jest.fn().mockResolvedValue(undefined),
  findUserByTfaRecoveryToken: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  findOneByEmail: jest.fn().mockResolvedValue(undefined),
  create: jest.fn().mockResolvedValue(undefined),
};
export default UserService__mock__;
