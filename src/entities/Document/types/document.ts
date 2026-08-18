export type DocumentQueryParams = { documentId: string };

export type DocumentDetail = {
  id: number;
  productName: string;
  amount: number;
  isProduct: boolean;
  lineId: string;
};

export type DocumentResponse = {
  success: boolean;
  data: { details: DocumentDetail[] };
};
