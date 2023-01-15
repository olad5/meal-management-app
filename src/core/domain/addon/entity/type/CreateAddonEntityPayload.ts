export type CreateAddonEntityPayload = {
  name: string;
  id?: string;
  description: string;
  price: number;
  category: string;
  brandId: string;
  createdAt?: Date;
  editedAt?: Date;
};
