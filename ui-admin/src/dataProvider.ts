import { DataProvider } from "react-admin";

const dataProvider: DataProvider = {
  getList: () => Promise.resolve({ data: [], total: 0 }),
  getOne: () => Promise.resolve({ data: {} as any }),
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  create: () => Promise.resolve({ data: {} as any }),
  update: () => Promise.resolve({ data: {} as any }),
  updateMany: () => Promise.resolve({ data: [] }),
  delete: () => Promise.resolve({ data: {} as any }),
  deleteMany: () => Promise.resolve({ data: [] }),
};

export default dataProvider;
