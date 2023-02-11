interface SeedRole {
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

interface SeedSchool {
  name: string;
  description: string;
  phone: string | null;
  address: string;
  certifications: string[];
  directorName: string;
  logo: string | null;
}

interface SeedData {
  school: SeedSchool;
  roles: SeedRole[];
  users: SeedUser[];
}

export const initialData: SeedData = {
  school: {
    name: 'Ballet Studio',
    description: 'Escuela de ballet',
    phone: null,
    address: 'Av Gobernadores #24',
    certifications: [],
    directorName: 'Dalia Nava',
    logo: null,
  },
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
