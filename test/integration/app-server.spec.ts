import axios, { AxiosInstance } from "axios";
import {
  initializeWebServer,
  stopWebServer,
} from "../../src/application/ServerApplication";

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const serverPort = Math.floor(Math.random() * (9000 - 5300 + 1) + 5300);
  const apiConnection = await initializeWebServer(serverPort);

  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true,
  };
  axiosAPIClient = axios.create(axiosConfig);
});

afterAll(async () => {
  await stopWebServer();
});

describe("/", () => {
  describe("GET /", () => {
    test("When request, Then should return hello world", async () => {
      const getResponse = await axiosAPIClient.get("/");

      expect(getResponse).toMatchObject({
        status: 200,
      });
    });
  });
});
