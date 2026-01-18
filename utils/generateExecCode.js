export const generateExecCode = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DOC-${num}`;
};
