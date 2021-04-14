interface IListPopulate {
  path: string;
  model: string;
  select: string;
}

export interface IGenerateModelArgs {
  listPopulate: IListPopulate[];
  listSelect: string;
  getPopulate: IListPopulate[];
  getSelect: string;
}

export interface IGenerateModelMethods {
  customGet?: (req: any, res: any) => any;
  customList?: (req: any, res: any) => any;
  customCreate?: (req: any, res: any) => any;
  customEdit?: (req: any, res: any) => any;
  customDelete?: (req: any, res: any) => any;
}

interface IAutocomplete {
  key: string;
  value: string;
}

export interface IFindBy {
  autocomplete: IAutocomplete;
  sort: string;
  page: number;
  limit: number;
  when: Object;
}

export interface IBelongsToMany {
  model: Object;
  value: Object;
}
