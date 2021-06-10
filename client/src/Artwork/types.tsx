export interface IArtwork {
  collections?: string[] | null;
  hidden: boolean;
  id: string;
  info: IInfo;
  name: string;
  path: string;
  price?: number | null;
  quantity: number;
  shippingDetails?: IShippingDetails | null;
  tags?: string[] | null;
  image?: string | null;
  imageUrl?: string | null;
  testOnly?: boolean | null;
}

export interface IInfo {
  size: string;
  status: string;
  type: string;
}

export interface IShippingDetails {
  height: number;
  length: number;
  ounces: number;
  pounds: number;
  width: number;
}
