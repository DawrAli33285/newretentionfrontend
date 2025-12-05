export const isUserAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  
  export const isAdminAuthenticated = () => {
    return localStorage.getItem("adminToken") !== null;
  };