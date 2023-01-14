export class BrandDITokens {
  // Use-cases

  public static readonly CreateBrandUseCase: unique symbol =
    Symbol("CreateBrandUseCase");

  public static readonly CreateAddonUseCase: unique symbol =
    Symbol("CreateAddonUseCase");

  public static readonly GetAddonUseCase: unique symbol =
    Symbol("GetAddonUseCase");

  public static readonly UpdateAddonUseCase: unique symbol =
    Symbol("UpdateAddonUseCase");

  public static readonly DeleteAddonUseCase: unique symbol =
    Symbol("DeleteAddonUseCase");

  public static readonly GetAddonListUseCase: unique symbol = Symbol(
    "GetAddonListUseCase",
  );

  // Repositories

  public static readonly BrandRepository: unique symbol =
    Symbol("BrandRepository");

  public static readonly AddonRepository: unique symbol =
    Symbol("AddonRepository");
}
