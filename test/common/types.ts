import { UserRole } from "../../src/core/common/enums/UserEnums";

type CommonResponseType = {
  code: number;
  message: string;
  timestamp: number;
};

type Addon = {
  id: string;
  name: string;
  brandId: string;
  description?: string;
  category?: string;
  price: number;
};

export type CreateAccountResponseType = CommonResponseType & {
  data?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "BASE_USER";
  };
};

export type RetrievedAddonsResponseType = CommonResponseType & {
  data?: Addon[];
};

export type SingleAddonResponseType = CommonResponseType & {
  data?: Addon;
};

export type CreateBrandResponseType = CommonResponseType & {
  data?: {
    id: string;
    name: string;
  };
};
export type CreateAddonCategoryResponseType = CommonResponseType & {
  data?: {
    id: string;
    name: string;
    brandId: string;
  };
};

export type LoginResponseType = CommonResponseType & {
  data?: {
    id: string;
    accessToken: string;
    role: UserRole;
  };
};
