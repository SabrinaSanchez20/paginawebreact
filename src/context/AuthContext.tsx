import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'isAdmin'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage:', error);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Intentar con JSON server primero
      try {
        const response = await fetch('http://localhost:3000/usuarios');
        const usuarios = await response.json();
        
        const foundUser = usuarios.find((u: User & { password: string }) => 
          u.email === email && u.password === password
        );

        if (foundUser) {
          const userWithoutPassword = {
            id: foundUser.id,
            nombre: foundUser.nombre,
            email: foundUser.email,
            telefono: foundUser.telefono,
            isAdmin: foundUser.isAdmin
          };
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          return true;
        }
      } catch (serverError) {
        console.log('JSON Server no disponible, usando localStorage');
      }

      // Fallback a localStorage
      const localUsers = localStorage.getItem('usuarios');
      if (localUsers) {
        const usuarios = JSON.parse(localUsers);
        const foundUser = usuarios.find((u: User & { password: string }) => 
          u.email === email && u.password === password
        );

        if (foundUser) {
          const userWithoutPassword = {
            id: foundUser.id,
            nombre: foundUser.nombre,
            email: foundUser.email,
            telefono: foundUser.telefono,
            isAdmin: foundUser.isAdmin
          };
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin'> & { password: string }): Promise<boolean> => {
    try {
      // Intentar con JSON server primero
      try {
        const response = await fetch('http://localhost:3000/usuarios');
        const usuarios = await response.json();
        
        const emailExists = usuarios.some((u: User) => u.email === userData.email);
        if (emailExists) {
          return false;
        }

        const newUser = {
          ...userData,
          isAdmin: false,
          id: Date.now()
        };

        const createResponse = await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (createResponse.ok) {
          const createdUser = await createResponse.json();
          
          // También guardar en localStorage como respaldo
          const localUsers = localStorage.getItem('usuarios');
          const usuarios = localUsers ? JSON.parse(localUsers) : [];
          usuarios.push(newUser);
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
          
          const userWithoutPassword = {
            id: createdUser.id,
            nombre: createdUser.nombre,
            email: createdUser.email,
            telefono: createdUser.telefono,
            isAdmin: createdUser.isAdmin
          };
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          return true;
        }
      } catch (serverError) {
        console.log('JSON Server no disponible, usando localStorage');
      }

      // Fallback a localStorage
      const localUsers = localStorage.getItem('usuarios');
      const usuarios = localUsers ? JSON.parse(localUsers) : [];
      
      const emailExists = usuarios.some((u: User) => u.email === userData.email);
      if (emailExists) {
        return false;
      }

      const newUser = {
        ...userData,
        isAdmin: false,
        id: Date.now()
      };

      usuarios.push(newUser);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      const userWithoutPassword = {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        telefono: newUser.telefono,
        isAdmin: newUser.isAdmin
      };
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
