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
  customGet?: () => any;
  customList?: () => any;
  customCreate?: () => any;
  customEdit?: () => any;
  customDelete?: () => any;
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
}
