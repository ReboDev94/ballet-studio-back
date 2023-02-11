interface Role {
  slug: string;
  name: string;
}

interface SeedUser {
  userName: string;
  name: string;
  password: string;
  phone?: string;
  email?: string;
  isOwner: boolean;
  isActive: boolean;
}

interface SeedData {
  roles: Role[];
  users: SeedUser[];
}

export const initialData: SeedData = {
  roles: [
    {
      slug: 'admin',
      name: 'Administrador',
    },
    {
      slug: 'teacher',
      name: 'Profesor',
    },
    {
      slug: 'receptionist',
      name: 'Recepcionista',
    },
  ],
  users: [
    {
      userName: 'admin1',
      name: 'Dalia Nava',
      password: 'HolaMundo1234#',
      isOwner: true,
      isActive: true,
    },
    {
      userName: 'teacher1',
      name: 'Yare Araujo',
      password: 'HolaMundo1234#',
      isOwner: false,
      isActive: true,
    },
    {
      userName: 'receptionist1',
      name: 'Beto',
      password: 'HolaMundo1234#',
      isOwner: false,
      isActive: true,
    },
  ],
};
