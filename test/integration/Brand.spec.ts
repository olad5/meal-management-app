import * as generate from "../common/generate";
import { getData, handleRequestFailure } from "../common/async";
import axios, { AxiosInstance } from "axios";
import {
  initializeWebServer,
  stopWebServer,
} from "../../src/application/ServerApplication";
import { TextUtils } from "../../src/core/common/util/text/TextUtils";

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

describe("/brands/", () => {
  describe("POST /", () => {
    type CreateBrandResponseType = {
      code: number;
      message: string;
      timestamp: number;
      data?: {
        id: string;
        name: string;
      };
    };

    const brandName: string = generate.shortNote;
    test("When I attempt to create a brand, a brand should be created and it should return a 200", async () => {
      const getResponse: CreateBrandResponseType = await axiosAPIClient.post(
        "/brands",
        {
          name: brandName,
        },
      );

      const expectedResponse: CreateBrandResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
        data: {
          name: TextUtils.toTitleCase(brandName),
          id: expect.any(String),
        },
      };

      expect(getResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create a brand that already exists, it should return a 403", async () => {
      const getResponse: CreateBrandResponseType = await axiosAPIClient.post(
        "/brands",
        {
          name: brandName,
        },
      );

      const expectedResponse: CreateBrandResponseType = {
        code: 403,
        message: "Brand already exists.",
        timestamp: expect.any(Number),
      };
      expect(getResponse).toMatchObject(expectedResponse);
    });
  });
});
