import { faker } from "@faker-js/faker";
import { v4 } from "uuid";

// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`;
const getEmail = faker.internet.email;
const getFirstName = faker.name.firstName;
const getLastName = faker.name.lastName;
const getDate = (start: Date, end: Date) =>
  faker.date.betweens(start, end, 1)[0];
const getBrandName = () => faker.commerce.productName();
const getAddonName = () => faker.commerce.product() + v4();
const getCategoryName = () => faker.commerce.department();
const getAddonDescription = () => faker.commerce.productDescription();
const getParagraph = faker.lorem.paragraph;
const getId = faker.datatype.uuid;

function signUpForm(overrides: { [key: string]: string } = {}) {
  return {
    email: getEmail().toLowerCase(),
    password: getPassword(),
    firstName: getFirstName(),
    lastName: getLastName(),
    role: "BASE_USER",
    ...overrides,
  };
}
function loginForm(overrides: { [key: string]: string } = {}) {
  return {
    password: getPassword(),
    ...overrides,
  };
}

function buildRes(overrides = {}) {
  const res = {
    json: jest.fn(() => res).mockName("json"),
    status: jest.fn(() => res).mockName("status"),
    ...overrides,
  };
  return res;
}

function buildNext(impl) {
  return jest.fn(impl).mockName("next");
}

function randomNumberInRange(max: number, min: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export {
  buildRes,
  buildNext,
  signUpForm,
  loginForm,
  randomNumberInRange,
  getBrandName,
  getAddonName,
  getAddonDescription,
  getCategoryName,
  getDate as newDate,
  getPassword as password,
  getEmail as email,
  getFirstName as firstname,
  getLastName as lastname,
  getParagraph as paragraph,
  getId as id,
};
