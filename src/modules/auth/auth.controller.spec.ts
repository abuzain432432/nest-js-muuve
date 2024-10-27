import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { MESSAGES } from "src/common/messages";
import mockAuthService from "src/modules/auth/__mock__/auth.service";

import { signupFixtures } from "./__fixtures__/auth.fixture";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dtos/signup.dto";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should return signup success with token", async () => {
      const result = { message: MESSAGES.SIGNUP_SUCCESS, token: "xyz" };
      const signupDto: SignupDto = signupFixtures.validSignupDto;
      jest
        .spyOn(authService, "signup")
        .mockImplementationOnce(async () => result);
      expect(await authController.signup(signupDto)).toEqual(result);
    });
    it("should return throw an exception b/c invalid data", async () => {
      const signupDto: SignupDto = signupFixtures.validSignupDto;
      jest.spyOn(authService, "signup").mockImplementationOnce(async () => {
        throw new BadRequestException("Duplicate email");
      });
      await expect(authController.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
