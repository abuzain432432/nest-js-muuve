import * as crypto from "crypto";

import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";

import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import * as qrcode from "qrcode";
import * as speakeasy from "speakeasy";
import { AuthProvidersEnum } from "src/common/enums/auth-providers.enum";
import { RolesEnum } from "src/common/enums/roles.enum";
import { createHashVerifier } from "src/common/lib/en-decryption.lib";
import * as enDecryptionLib from "src/common/lib/en-decryption.lib";
import { MESSAGES } from "src/common/messages";
import { userFixtures } from "src/modules/user/__fixtures__/user.fixture";
import UserService__mock__ from "src/modules/user/__mock__/user.service__mock__";
import { UserService } from "src/modules/user/user.service";

import { EmailNotificationService } from "../email-notification/email-notification.service";

import { AuthService } from "./auth.service";
import { SignupDto } from "./dtos/signup.dto";

const MOCK_TOKEN = "mock-token";
const MOCK_OTP = "mock-otp";
const INVALID_MOCK_OTP = "invalid-otp";
const MOCK_QR_CODE = "data:image/png;base64,....";
const moduleMocker = new ModuleMocker(global);
const VALID_OTP = "VALID_OTP";
const HASHED_VALID_OTP = createHashVerifier(VALID_OTP);

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;

  let emailNotificationService: EmailNotificationService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return { signAsync: jest.fn().mockResolvedValue(MOCK_TOKEN) };
        }
        if (token === UserService) {
          return UserService__mock__;
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);

    emailNotificationService = moduleRef.get<EmailNotificationService>(
      EmailNotificationService,
    );
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("Login", () => {
    it("should return a valid token and user on login", async () => {
      // Act
      const result = await authService.login(
        userFixtures.validUserResponseDto as any,
      );
      // Assert
      expect(result).toEqual({
        token: MOCK_TOKEN,
        user: userFixtures.validUserResponseDto,
      });
    });
  });

  describe("Activate Account", () => {
    it("should activate the account successfully", async () => {
      // Act
      const user = {
        active: false,
        save: jest.fn().mockResolvedValue(undefined),
      };
      jest
        .spyOn(userService, "findOneByOtp")
        .mockResolvedValueOnce(user as any);
      const result = await authService.activateAccount(MOCK_OTP);
      // Assert
      expect(user.active).toBe(true);
      expect(result).toEqual({ message: MESSAGES.ACCOUNT_ACTIVATED });
    });
    it("should throw Exception if user is not found", async () => {
      // Arrange
      jest.spyOn(userService, "findOneByOtp").mockImplementationOnce(() => {
        throw new BadRequestException(MESSAGES.INVALID_OTP_TOKEN);
      });

      // Act & Assert
      await expect(
        authService.activateAccount(INVALID_MOCK_OTP),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe("Generate Qr Code", () => {
    it("should generate a QR code successfully", async () => {
      // Arrange
      const secret = speakeasy.generateSecret({
        name: `Muuve (${userFixtures.inactiveTfaUserResponseDto.email})`,
        length: 20,
      });
      jest.spyOn(speakeasy, "generateSecret").mockReturnValue(secret);
      jest.spyOn(qrcode, "toDataURL").mockResolvedValue(MOCK_QR_CODE);
      // Act
      const result = await authService.generateQrCode(
        userFixtures.inactiveTfaUserResponseDto as any,
      );
      // Assert
      expect(userService.saveTfaSecret).toHaveBeenCalledWith(
        userFixtures.inactiveTfaUserResponseDto._id,
        secret.base32,
      );
      expect(result).toEqual({ url: MOCK_QR_CODE });
    });

    it(" throw Exception if user account provider is google", async () => {
      // Arrange
      const secret = speakeasy.generateSecret({
        name: `Muuve (${userFixtures.inactiveTfaUserResponseDto.email})`,
        length: 20,
      });
      jest.spyOn(speakeasy, "generateSecret").mockReturnValue(secret);
      jest.spyOn(qrcode, "toDataURL").mockResolvedValue(MOCK_QR_CODE);
      // Act & Assert
      expect(
        authService.generateQrCode(userFixtures.googleUserResponseDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    describe("Recover TFA", () => {
      it("should recover TFA successfully with a valid OTP", async () => {
        // Arrange
        const user = {
          ...userFixtures.validUserResponseDto,
          tfaSecret: HASHED_VALID_OTP,
          save: jest.fn().mockResolvedValue(undefined),
        };
        jest
          .spyOn(userService, "findUserByTfaRecoveryToken")
          .mockResolvedValue(user as any);

        // Act
        const result = await authService.recoverTfa(VALID_OTP);
        // Assert
        expect(result).toEqual({
          message: MESSAGES.TWO_FACTOR_DISABLED_SUCCESS,
        });
      });
      it("should throw BadRequestException if OTP is invalid", async () => {
        // Arrange
        jest
          .spyOn(userService, "findUserByTfaRecoveryToken")
          .mockImplementationOnce(() => {
            throw new BadRequestException(MESSAGES.INVALID_OTP_TOKEN);
          });

        // Act & Assert
        await expect(authService.recoverTfa(INVALID_MOCK_OTP)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });
  describe("Enable Tfa", () => {
    it("should enable TFA successfully", async () => {
      jest.spyOn(authService, "verifyMfaToken").mockReturnValue(true);
      jest.spyOn(userService, "update").mockResolvedValue(undefined);

      // Act
      const result = await authService.enableTfa(
        userFixtures.inactiveTfaUserResponseDto as any,
        MOCK_OTP,
      );

      // Assert
      expect(userService.update).toHaveBeenCalledWith(
        userFixtures.inactiveTfaUserResponseDto._id,
        {
          tfa: true,
          tfaRecoveryToken: expect.any(String),
        },
      );
      expect(result).toEqual({
        message: MESSAGES.TWO_FACTOR_ENABLED_SUCCESS,
        recoveryToken: expect.any(String),
      });
    });

    it("should throw BadRequestException if TFA is already enabled", async () => {
      // Act & Assert
      await expect(
        authService.enableTfa(
          userFixtures.validUserResponseDto as any,
          MOCK_OTP,
        ),
      ).rejects.toThrow(MESSAGES.ALREADY_TFA_ENABLED);
    });

    it("should throw BadRequestException if the OTP token is invalid", async () => {
      jest.spyOn(authService, "verifyMfaToken").mockReturnValue(false);
      // Act & Assert
      await expect(
        authService.enableTfa(
          userFixtures.inactiveTfaUserResponseDto as any,
          INVALID_MOCK_OTP,
        ),
      ).rejects.toThrow(MESSAGES.INVALID_OTP_TOKEN);
    });
  });
  describe("Disable Tfa", () => {
    it("should disable TFA successfully", async () => {
      jest.spyOn(authService, "verifyMfaToken").mockReturnValue(true);
      jest.spyOn(userService, "update").mockResolvedValue(undefined);

      // Act
      const result = await authService.disableTfa(
        userFixtures.validUserResponseDto as any,
        MOCK_OTP,
      );

      // Assert
      expect(userService.update).toHaveBeenCalledWith(
        userFixtures.validUserResponseDto._id,
        {
          tfa: false,
          tfaSecret: "",
        },
      );
      expect(result).toEqual({
        message: MESSAGES.TWO_FACTOR_DISABLED_SUCCESS,
      });
    });

    it("should throw BadRequestException if TFA is already disabled", async () => {
      // Act & Assert
      await expect(
        authService.disableTfa(
          userFixtures.inactiveTfaUserResponseDto as any,
          MOCK_OTP,
        ),
      ).rejects.toThrow(MESSAGES.ALREADY_TFA_DISABLED);
    });

    it("should throw BadRequestException if the OTP token is invalid", async () => {
      jest.spyOn(authService, "verifyMfaToken").mockReturnValue(false);
      // Act & Assert
      await expect(
        authService.disableTfa(
          userFixtures.validUserResponseDto as any,
          INVALID_MOCK_OTP,
        ),
      ).rejects.toThrow(MESSAGES.INVALID_OTP_TOKEN);
    });
  });
  describe("validateUser", () => {
    it("should return the user if email is found and password matches", async () => {
      // Arrange
      const USER = {
        ...userFixtures.validUserResponseDto,
        password: "password",
        correctPassword: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue(userFixtures.validUserResponseDto),
      };
      jest.spyOn(userService, "findOneByEmail").mockResolvedValue(USER as any);

      // Act
      const result = await authService.validateUser(USER.email, USER.password);

      // Assert
      expect(result).toEqual(userFixtures.validUserResponseDto);
    });
    it("should return null if the password does not match", async () => {
      // Arrange
      const USER = {
        ...userFixtures.validUserResponseDto,
        correctPassword: jest.fn().mockResolvedValue(false),
        password: "wrong",
      };
      jest.spyOn(userService, "findOneByEmail").mockResolvedValue(USER as any);

      // Act
      const result = await authService.validateUser(USER.email, USER.password);

      // Assert
      expect(result).toBeNull();
    });
  });
  describe("signup", () => {
    it("should handle errors during signup", async () => {
      const USER = {
        ...userFixtures.validUserResponseDto,
        password: "password",
        passwordConfirm: "password",
      } as SignupDto;
      jest
        .spyOn(userService, "create")
        .mockRejectedValue(new Error("User creation failed"));

      // Act & Assert
      await expect(authService.signup(USER)).rejects.toThrow(
        "User creation failed",
      );
    });
    it("should sign up a user, send activation email, and return a token", async () => {
      // Arrange
      const signupDto: SignupDto = {
        ...userFixtures.validUserResponseDto,
        password: "password123",
        passwordConfirm: "password",
        role: RolesEnum.AGENT,
      };
      const otpDetails = {
        hashedOtp: "hashedOtp123",
        otpExpiresAt: Date.now(),
        otpToken: "otpToken123",
      };
      const createdUser = {
        ...userFixtures.validUserResponseDto,
        toObject: jest.fn().mockReturnValue({
          ...signupDto,
        }),
      };
      jest.spyOn(authService, "createOtp").mockResolvedValue(otpDetails);
      jest.spyOn(userService, "create").mockResolvedValue(createdUser as any);

      // Act
      const result = await authService.signup(signupDto);

      // Assert
      expect(userService.create).toHaveBeenCalledWith({
        ...signupDto,
        otp: otpDetails.hashedOtp,
        otpExpiresAt: otpDetails.otpExpiresAt,
        provider: AuthProvidersEnum.CUSTOM,
        activate: false,
      });
      expect(
        emailNotificationService.sendActivateAccountEmail,
      ).toHaveBeenCalledWith({
        firstName: createdUser.firstName,
        email: createdUser.email,
        otp: otpDetails.otpToken,
      });

      expect(result).toEqual({
        message: MESSAGES.SIGNUP_SUCCESS,
        token: MOCK_TOKEN,
      });
    });
  });
  describe("createOtp", () => {
    it("should generate an OTP, hash it, and return the expiration time", async () => {
      // Arrange
      const otpTokenMock = "A1B2C3";
      const hashedOtpMock = "hashedOtpValue123";
      const currentTimeMock = Date.now();
      const otpExpiresAtMock = currentTimeMock + 30 * 60 * 1000; // 30 minutes expiration

      jest.spyOn(crypto, "randomBytes").mockReturnValueOnce("a1b2c3" as any);
      jest.spyOn(global.Date, "now").mockReturnValue(currentTimeMock);
      jest
        .spyOn(enDecryptionLib, "createHashVerifier")
        .mockReturnValue(hashedOtpMock);

      // Act
      const result = await authService.createOtp();

      // Assert
      expect(crypto.randomBytes).toHaveBeenCalledWith(3);
      expect(enDecryptionLib.createHashVerifier).toHaveBeenCalledWith(
        otpTokenMock,
      );
      expect(result).toEqual({
        otpToken: otpTokenMock,
        hashedOtp: hashedOtpMock,
        otpExpiresAt: otpExpiresAtMock,
      });
    });
  });
});
