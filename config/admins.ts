// config/admins.ts
// Simula un database di admin (in produzione usa un vero DB)

interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string; // In produzione, usa hash!
}

const ADMINS: AdminUser[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123', // Cambia in produzione!
  },
  // Aggiungi altri admin se necessario
];

export const checkAdminCredentials = (email: string, password: string): { success: boolean; user?: AdminUser } => {
  const user = ADMINS.find(admin => admin.email === email && admin.password === password);
  if (user) {
    return { success: true, user };
  }
  return { success: false };
};