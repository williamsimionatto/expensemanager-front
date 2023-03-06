import { LoadCategories } from "../../domain/usecase";

export class RemoteLoadCategories implements LoadCategories {
  async load(): Promise<LoadCategories.Result> {
    return new Promise(resolve => resolve([]));
  }
}