import * as generate from "../common/generate";
import { getData, handleRequestFailure } from "../common/async";
import axios, { AxiosInstance } from "axios";
import {
  initializeWebServer,
  stopWebServer,
} from "../../src/application/ServerApplication";
import { TextUtils } from "../../src/core/common/util/text/TextUtils";
import {
  CreateBrandResponseType,
  LoginResponseType,
  SingleAddonResponseType,
  RetrievedAddonsResponseType,
} from "../common/types";
import { v4 } from "uuid";

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
  let adminLoginDataAccessToken: string;
  describe("POST /", () => {
    const brandName: string = generate.getBrandName();
    test("When I attempt to create a brand, a brand should be created and it should return a 200", async () => {
      const { email, password, firstName, lastName, role } =
        generate.signUpForm({ role: "ADMIN" });

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

      adminLoginDataAccessToken = loginResponse.data.accessToken;
      const getResponse: CreateBrandResponseType = await axiosAPIClient.post(
        "/brands",
        {
          name: brandName,
        },
        {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
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
        {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
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
  describe("POST /brands/:brandId/addons", () => {
    const brandName: string = generate.getBrandName();
    const addonName: string = generate.getAddonName();
    const addonDescription: string = generate.getAddonDescription();
    const addonPrice: number = generate.randomNumberInRange(100, 10);
    const addonCategory: string = generate.getCategoryName();

    let brandId: string;
    test("When I attempt to create an addon, the addon should be created and it should return a 200", async () => {
      const createBrandResponse: CreateBrandResponseType =
        await axiosAPIClient.post(
          "/brands",
          {
            name: brandName,
          },

          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      brandId = createBrandResponse.data.id;

      const createAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.post(
          `/brands/${brandId}/addons`,
          {
            name: addonName,
            description: addonDescription,
            price: addonPrice,
            category: addonCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const expectedResponse: SingleAddonResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
        data: {
          id: expect.any(String),
          name: TextUtils.toTitleCase(addonName),
          brandId: brandId,
          description: addonDescription,
          category: TextUtils.toTitleCase(addonCategory),
          price: addonPrice,
        },
      };

      expect(createAddonResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create an addon that already exists, it should return a 403", async () => {
      const getResponse: SingleAddonResponseType = await axiosAPIClient.post(
        `/brands/${brandId}/addons`,
        {
          name: addonName,
          description: addonDescription,
          price: addonPrice,
          category: addonCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        },
      );

      const expectedResponse: SingleAddonResponseType = {
        code: 403,
        message: "Addon already exists.",
        timestamp: expect.any(Number),
      };
      expect(getResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create an addon that has a negative price exists, it should return a 403", async () => {
      const getResponse: SingleAddonResponseType = await axiosAPIClient.post(
        `/brands/${brandId}/addons`,
        {
          name: generate.paragraph().slice(0, 14),
          description: generate.getAddonDescription,
          price: -10,
          category: addonCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        },
      );

      const expectedResponse: SingleAddonResponseType = {
        code: 403,
        message: "Addon Price cannot be negative.",
        timestamp: expect.any(Number),
      };
      expect(getResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create an addon without the description and category param, the addon should be created and it should return a 200", async () => {
      const addonName: string = generate.getAddonName();
      const addonPrice: number = generate.randomNumberInRange(100, 10);

      const createAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.post(
          `/brands/${brandId}/addons`,
          {
            name: addonName,
            price: addonPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const expectedResponse: SingleAddonResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
        data: {
          brandId: brandId,
          id: expect.any(String),
          name: TextUtils.toTitleCase(addonName),
          price: addonPrice,
        },
      };

      expect(createAddonResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create an addon with a brand that does not exist, the addon should not be created and it should return a 403", async () => {
      const addonName: string = generate.getAddonName();
      const addonPrice: number = generate.randomNumberInRange(100, 10);

      const brandId: string = v4();
      const createAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.post(
          `/brands/${brandId}/addons`,
          {
            name: addonName,
            price: addonPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const expectedResponse: SingleAddonResponseType = {
        code: 403,
        message: "Can not create addon, Brand does not exist.",
        timestamp: expect.any(Number),
      };

      expect(createAddonResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to create an addon as a non-admin, the addon should not be created and it should return a 403", async () => {
      const { email, password, firstName, lastName, role } =
        generate.signUpForm({ role: "BASE_USER" });

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

      const baseUserloginDataAccessToken = loginResponse.data.accessToken;
      const addonName: string = generate.getAddonName();
      const addonPrice: number = generate.randomNumberInRange(100, 10);

      const createAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.post(
          `/brands/${brandId}/addons`,
          {
            name: addonName,
            price: addonPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${baseUserloginDataAccessToken}`,
            },
          },
        );

      const expectedResponse: SingleAddonResponseType = {
        code: 403,
        message: "Access denied.",
        timestamp: expect.any(Number),
      };

      expect(createAddonResponse).toMatchObject(expectedResponse);
    });
  });
  describe("GET /brands/:brandId/addons", () => {
    const brandName: string = generate.getBrandName();
    const createdAddonIds: string[] = [];
    const retrievedAddonIds: string[] = [];

    let brandId: string;

    test("When I attempt to retrieve a list of all addons, the list should be retrieved and it should return a 200", async () => {
      const createBrandResponse: CreateBrandResponseType =
        await axiosAPIClient.post(
          "/brands",
          {
            name: brandName,
          },

          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      brandId = createBrandResponse.data.id;

      const numberOfAddonsToCreate = 20;
      for (let i = 0; i < numberOfAddonsToCreate; i++) {
        const addonName: string = generate.getAddonName();
        const addonDescription: string = generate.getAddonDescription();
        const addonPrice: number = generate.randomNumberInRange(100, 10);
        const addonCategory: string = generate.getCategoryName();
        const createAddonResponse: SingleAddonResponseType =
          await axiosAPIClient.post(
            `/brands/${brandId}/addons`,
            {
              name: addonName,
              description: addonDescription,
              price: addonPrice,
              category: addonCategory,
            },
            {
              headers: {
                Authorization: `Bearer ${adminLoginDataAccessToken}`,
              },
            },
          );

        createdAddonIds.push(createAddonResponse.data.id);
      }
      const retrievedAddonsResponse: RetrievedAddonsResponseType =
        await axiosAPIClient.get(`/brands/${brandId}/addons`, {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        });
      expect(retrievedAddonsResponse.code).toEqual(200);

      expect(retrievedAddonsResponse.message).toEqual("Success.");
      expect(createdAddonIds.length).toEqual(
        retrievedAddonsResponse.data.length,
      );

      retrievedAddonIds.push(
        ...retrievedAddonsResponse.data.map((addon) => addon.id),
      );

      const areAddonIdsTheSame: boolean =
        JSON.stringify(createdAddonIds) === JSON.stringify(retrievedAddonIds);

      expect(areAddonIdsTheSame).toEqual(true);
    });
    test("When I attempt to retrieve a list of all addons for a brand that does not exist, a list should not be retrieved and it should return a 404", async () => {
      const brandId: string = v4();

      const retrievedAddonsResponse: RetrievedAddonsResponseType =
        await axiosAPIClient.get(`/brands/${brandId}/addons`, {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        });

      const expectedResponse: SingleAddonResponseType = {
        code: 404,
        message: "Brand Not Found.",
        timestamp: expect.any(Number),
      };
      expect(retrievedAddonsResponse).toMatchObject(expectedResponse);
    });
  });
  describe("GET /brands/:brandId/addons/:addonId", () => {
    const brandName: string = generate.getBrandName();

    let brandId: string;

    test("When I attempt to retrieve a single addon for a brand, the addon should be retrieved and it should return a 200", async () => {
      const createBrandResponse: CreateBrandResponseType =
        await axiosAPIClient.post(
          "/brands",
          {
            name: brandName,
          },

          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      brandId = createBrandResponse.data.id;
      const addonName: string = generate.getAddonName();
      const addonDescription: string = generate.getAddonDescription();
      const addonPrice: number = generate.randomNumberInRange(100, 10);
      const addonCategory: string = generate.getCategoryName();
      const createAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.post(
          `/brands/${brandId}/addons`,
          {
            name: addonName,
            description: addonDescription,
            price: addonPrice,
            category: addonCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const addonId: string = createAddonResponse.data.id;
      const retrievedAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.get(`/brands/${brandId}/addons/${addonId}`, {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        });

      const expectedResponse: SingleAddonResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
        data: {
          name: TextUtils.toTitleCase(addonName),
          id: addonId,
          brandId: expect.any(String),
          description: addonDescription,
          category: addonCategory,
          price: addonPrice,
        },
      };
      expect(retrievedAddonResponse).toMatchObject(expectedResponse);
    });

    test("When I attempt to retrieve a single addon for a brand and the addon does not exist, it should return a not found and a 404", async () => {
      const brandName: string = generate.getBrandName();
      const createBrandResponse: CreateBrandResponseType =
        await axiosAPIClient.post(
          "/brands",
          {
            name: brandName,
          },

          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      brandId = createBrandResponse.data.id;

      const addonId: string = v4();
      const retrievedAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.get(`/brands/${brandId}/addons/${addonId}`, {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        });

      const expectedResponse: SingleAddonResponseType = {
        code: 404,
        message: "Addon does not exist.",
        timestamp: expect.any(Number),
      };
      expect(retrievedAddonResponse).toMatchObject(expectedResponse);
    });
  });
  describe("PATCH /brands/:brandId/addons/:addonId", () => {
    const brandName: string = generate.getBrandName();

    let brandId: string;

    test("When I attempt to update a single addon for a brand, the addon should be updated and it should return a 200", async () => {
      const createBrandResponse: CreateBrandResponseType =
        await axiosAPIClient.post(
          "/brands",
          {
            name: brandName,
          },

          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      brandId = createBrandResponse.data.id;
      const addonName: string = generate.getAddonName();
      const addonDescription: string = generate.getAddonDescription();
      const addonPrice: number = generate.randomNumberInRange(100, 10);
      const addonCategory: string = generate.getCategoryName();
      const createAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.post(
          `/brands/${brandId}/addons`,
          {
            name: addonName,
            description: addonDescription,
            price: addonPrice,
            category: addonCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const addonId: string = createAddonResponse.data.id;

      const updatedAddonName: string = generate.getAddonName();
      const updatedAddonPrice: number = generate.randomNumberInRange(100, 10);
      const updatedAddonCategory: string = generate.getCategoryName();
      const updatedAddonDescription: string = generate.getAddonDescription();

      const patchAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.patch(
          `/brands/${brandId}/addons/${addonId}`,
          {
            name: updatedAddonName,
            description: updatedAddonDescription,
            price: updatedAddonPrice,
            category: updatedAddonCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const expectedResponse: SingleAddonResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
        data: {
          name: TextUtils.toTitleCase(updatedAddonName),
          id: addonId,
          brandId: expect.any(String),
          description: updatedAddonDescription,
          category: updatedAddonCategory,
          price: updatedAddonPrice,
        },
      };

      expect(patchAddonResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to update a single addon for a brand  and the addon does not exist, it should return a 404", async () => {
      const addonId: string = v4();
      const updatedAddonName: string = generate.getAddonName();
      const updatedAddonPrice: number = generate.randomNumberInRange(100, 10);
      const updatedAddonCategory: string = generate.getCategoryName();
      const updatedAddonDescription: string = generate.getAddonDescription();

      const patchAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.patch(
          `/brands/${brandId}/addons/${addonId}`,
          {
            name: updatedAddonName,
            description: updatedAddonDescription,
            price: updatedAddonPrice,
            category: updatedAddonCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const expectedResponse: SingleAddonResponseType = {
        code: 404,
        message: "Addon does not exist.",
        timestamp: expect.any(Number),
      };

      expect(patchAddonResponse).toMatchObject(expectedResponse);
    });
    test("When I attempt to update a single addon for a brand with optional name, description, price, category; the addon should be updated and it should return a 200", async () => {
      const numberOfAddonsToCreate = 10;
      for (let i = 0; i < numberOfAddonsToCreate; i++) {
        const addonName: string = generate.getAddonName();
        const addonDescription: string = generate.getAddonDescription();
        const addonPrice: number = generate.randomNumberInRange(100, 10);
        const addonCategory: string = generate.getCategoryName();
        const createAddonResponse: SingleAddonResponseType =
          await axiosAPIClient.post(
            `/brands/${brandId}/addons`,
            {
              name: addonName,
              description: addonDescription,
              price: addonPrice,
              category: addonCategory,
            },
            {
              headers: {
                Authorization: `Bearer ${adminLoginDataAccessToken}`,
              },
            },
          );
        const addonId = createAddonResponse.data.id;
        {
          let updatedAddonName: string;
          let updatedAddonPrice: number;
          let updatedAddonCategory: string;
          let updatedAddonDescription: string;

          const conditionForUndefinedParams: boolean = i % 2 == 0;
          if (conditionForUndefinedParams) {
            updatedAddonName = generate.getAddonName();
            updatedAddonPrice = generate.randomNumberInRange(100, 10);
            updatedAddonCategory = generate.getCategoryName();
            updatedAddonDescription = generate.getAddonDescription();
          }
          const patchBody = {
            name: updatedAddonName,
            description: updatedAddonDescription,
            price: updatedAddonPrice,
            category: updatedAddonCategory,
          };

          const patchAddonResponse: SingleAddonResponseType =
            await axiosAPIClient.patch(
              `/brands/${brandId}/addons/${addonId}`,
              patchBody,
              {
                headers: {
                  Authorization: `Bearer ${adminLoginDataAccessToken}`,
                },
              },
            );

          const expectedName: string = conditionForUndefinedParams
            ? TextUtils.toTitleCase(updatedAddonName)
            : TextUtils.toTitleCase(addonName);
          const expectedDescription: string = conditionForUndefinedParams
            ? updatedAddonDescription
            : addonDescription;
          const expectedCategory: string = conditionForUndefinedParams
            ? updatedAddonCategory
            : addonCategory;
          const expectedPrice: number = conditionForUndefinedParams
            ? updatedAddonPrice
            : addonPrice;
          const expectedResponse: SingleAddonResponseType = {
            code: 200,
            message: "Success.",
            timestamp: expect.any(Number),
            data: {
              name: expectedName,
              id: addonId,
              brandId: expect.any(String),
              description: expectedDescription,
              category: expectedCategory,
              price: expectedPrice,
            },
          };

          expect(patchAddonResponse).toMatchObject(expectedResponse);
        }
      }
    });
  });
  describe("DELETE /brands/:brandId/addons/:addonId", () => {
    const brandName: string = generate.getBrandName();

    let brandId: string;

    test("When I attempt to delete a single addon for a brand, the addon should be deleted and it should return a 200", async () => {
      const createBrandResponse: CreateBrandResponseType =
        await axiosAPIClient.post(
          "/brands",
          {
            name: brandName,
          },

          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      brandId = createBrandResponse.data.id;
      const addonName: string = generate.getAddonName();
      const addonDescription: string = generate.getAddonDescription();
      const addonPrice: number = generate.randomNumberInRange(100, 10);
      const addonCategory: string = generate.getCategoryName();
      const createAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.post(
          `/brands/${brandId}/addons`,
          {
            name: addonName,
            description: addonDescription,
            price: addonPrice,
            category: addonCategory,
          },
          {
            headers: {
              Authorization: `Bearer ${adminLoginDataAccessToken}`,
            },
          },
        );

      const addonId: string = createAddonResponse.data.id;

      const deleteAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.delete(`/brands/${brandId}/addons/${addonId}`, {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        });

      const expectedDeletedResponse: SingleAddonResponseType = {
        code: 200,
        message: "Success.",
        timestamp: expect.any(Number),
      };

      expect(deleteAddonResponse).toMatchObject(expectedDeletedResponse);
      const retrievedAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.get(`/brands/${brandId}/addons/${addonId}`, {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        });

      const expectedRetrievedResponse: SingleAddonResponseType = {
        code: 404,
        message: "Addon does not exist.",
        timestamp: expect.any(Number),
      };
      expect(retrievedAddonResponse).toMatchObject(expectedRetrievedResponse);
    });
    test("When I attempt to delete a single addon for a brand and the addon does not exist, it should return a 404", async () => {
      const addonId: string = v4();

      const deleteAddonResponse: SingleAddonResponseType =
        await axiosAPIClient.delete(`/brands/${brandId}/addons/${addonId}`, {
          headers: {
            Authorization: `Bearer ${adminLoginDataAccessToken}`,
          },
        });

      const expectedDeletedResponse: SingleAddonResponseType = {
        code: 404,
        message: "Addon does not exist.",
        timestamp: expect.any(Number),
      };

      expect(deleteAddonResponse).toMatchObject(expectedDeletedResponse);
    });
  });
});
