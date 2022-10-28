export const repositoryMockFactory = jest.fn(() => ({
  test: jest.fn((id: number) => String(id)),
}));
