export const generateEnquiryId = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `STU-${year}-${rand}`;
};
