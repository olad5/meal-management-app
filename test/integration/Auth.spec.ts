import * as generate from "../common/generate";
import { getData, handleRequestFailure } from "../common/async";
import axios, { AxiosInstance } from "axios";
import {
  initializeWebServer,
  stopWebServer,
} from "../../src/application/ServerApplication";
import { UserRole } from "../../src/core/common/enums/UserEnums";
import { LoginResponseType } from "../common/types";

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const randomServerPort = generate.randomNumberInRange(9000, 5300);
  const apiConnection = await initializeWebServer(randomServerPort);

  const axiosConfig = {
    baseURL: `http://localhost:${apiConnection.port}`,
    validateStatus: () => true,
  };
  axiosAPIClient = axios.create(axiosConfig);
  axiosAPIClient.interceptors.response.use(getData, handleRequestFailure);
});

afterAll(async () => {
  await stopWebServer();
});

describe("/auth/", () => {
  describe("POST /login", () => {
    const { email, password, firstName, lastName, role } = generate.signUpForm({
      role: "ADMIN",
    });
    test("When I attempt to login, the login attempt should be successful and it should return a 200", async () => {
      await axiosAPIClient.post("/users", {
        email,
        password,
        firstName,
        lastName,
        role,
      });
      const loginResponse: LoginResponseType = await axiosAPIClient.post(
        "/auth/login",
        {
          email,
          password,
        },
      );

      const expectedResponse: LoginResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
        data: {
          accessToken: expect.any(String),
          id: expect.any(String),
          role: role as UserRole,
        },
      };
      expect(loginResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create an account with an email that already exists, it should return a 403", async () => {
      const { email, password, role } = generate.signUpForm({ role: "ADMIN" });
      const loginResponse: LoginResponseType = await axiosAPIClient.post(
        "/auth/login",
        {
          email,
          password,
          role,
        },
      );

      const expectedResponse = {
        code: 402,
        message: "Wrong Credentials.",
        timestamp: expect.any(Number),
      };
      expect(loginResponse).toMatchObject(expectedResponse);
    });
  });
});
