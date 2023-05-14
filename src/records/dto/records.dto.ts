export const RecordsBody = {
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
