export const selectStyles: any = {
  control: (base: any, state: string) => ({
    ...base,
    background: '#1e293b',
    color: 'white',
    borderColor: '#334155',
  }),
  menu: (base: any, state: string) => ({
    ...base,
    background: '#1e293b',
    borderColor: '#334155',
  }),
  singleValue: (base: any, state: string) => ({
    ...base,
    color: 'white',
  }),
  placeholder: (base: any, state: string) => ({
    ...base,
    color: 'white',
  }),
  option: (base: any, state: string) => ({
    ...base,
    color: 'white',
    background: '#1e293b',
    borderColor: '#1e293b',
  }),
};
