import * as generate from "../common/generate";
import { getData, handleRequestFailure } from "../common/async";
import axios, { AxiosInstance } from "axios";
import {
  initializeWebServer,
  stopWebServer,
} from "../../src/application/ServerApplication";

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

describe("/users/", () => {
  describe("POST /", () => {
    type CreateAccountResponseType = {
      code: number;
      message: string;
      timestamp: number;
      data?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "ADMIN" | "BASE_USER";
      };
    };
    const { email, userName, password, firstName, lastName, role } =
      generate.signUpForm();
    test("When I attempt to create an account, user account should be created and it should return a 200", async () => {
      const getResponse: CreateAccountResponseType = await axiosAPIClient.post(
        "/users",
        {
          email,
          userName,
          password,
          firstName,
          lastName,
          role,
        },
      );

      const expectedResponse: CreateAccountResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
        data: {
          firstName,
          lastName,
          role: "BASE_USER",
          email: email,
          id: expect.any(String),
        },
      };
      expect(getResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create an account with an email that already exists, it should return a 403", async () => {
      const getResponse: CreateAccountResponseType = await axiosAPIClient.post(
        "/users",
        {
          email,
          userName,
          password,
          firstName,
          lastName,
          role,
        },
      );

      const expectedResponse: CreateAccountResponseType = {
        code: 403,
        message: "User already exists.",
        timestamp: expect.any(Number),
      };
      expect(getResponse).toMatchObject(expectedResponse);
    });
  });
});
