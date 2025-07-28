// app/_layout.js
import { Stack } from 'expo-router';
import AuthProvider from '../src/context/AuthContext';  // Tu proveedor de autenticación

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack 
        screenOptions={{
          headerShown: true,  // Asegura que el header se muestre
        }}
      />
    </AuthProvider>
  );
}
