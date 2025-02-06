export const getRoleFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // Decode token to get role (assuming JWT)
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role;
};