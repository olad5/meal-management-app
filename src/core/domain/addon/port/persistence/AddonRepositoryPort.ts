import { Optional } from "../../../../common/type/CommonTypes";
import { Addon } from "../../entity/Addon";

export interface AddonRepositoryPort {
  findAddonByAddonId(addonId: string): Promise<Optional<Addon>>;
  findAddonByAddonName(addonName: string): Promise<Optional<Addon>>;
  findAddonsByBrandId(brandId: string): Promise<Optional<Addon[]>>;
  doesBrandExist(brandId: string): Promise<boolean>;
  createAddon(addon: Addon): Promise<void>;
}
