import { faker } from "@faker-js/faker";

// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`;
const getUsername = faker.internet.userName;
const getEmail = faker.internet.email;
const getFirstName = faker.name.firstName;
const getLastName = faker.name.lastName;
const getDate = (start: Date, end: Date) =>
  faker.date.betweens(start, end, 1)[0];
const getShortNote: string = faker.lorem.paragraph(1).slice(0, 14);
const getParagraph = faker.lorem.paragraph;
const getId = faker.datatype.uuid;

function buildUser({ password = getPassword(), ...overrides } = {}) {
  return {
    id: getId(),
    username: getUsername(),
    password,
    ...overrides,
  };
}

function signUpForm(overrides: { [key: string]: string } = {}) {
  return {
    email: getEmail().toLowerCase(),
    password: getPassword(),
    userName: getUsername().toString().slice(0, 14),
    firstName: getFirstName(),
    lastName: getLastName(),
    role: "BASE_USER",
    ...overrides,
  };
}
function loginForm(overrides: { [key: string]: string } = {}) {
  return {
    username: getUsername(),
    password: getPassword(),
    ...overrides,
  };
}

function buildReq({ user = buildUser(), ...overrides } = {}) {
  const req = { user, body: {}, params: {}, ...overrides };
  return req;
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
  return Math.floor(Math.random() * (max - min + 1) + max);
}

export {
  buildReq,
  buildRes,
  buildNext,
  signUpForm,
  loginForm,
  randomNumberInRange,
  getDate as newDate,
  getPassword as password,
  getEmail as email,
  getUsername as username,
  getFirstName as firstname,
  getLastName as lastname,
  getShortNote as shortNote,
  getParagraph as paragraph,
  getId as id,
};
