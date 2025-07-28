import { useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../src/context/AuthContext';

export default function Lobby() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      '¿Cerrar sesión?',
      '¿Estás seguro que quieres salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Lobby 🎮</Text>

      {user ? (
        <>
          <Text style={styles.info}>👤 Usuario: {user.username}</Text>
          <Text style={styles.info}>📧 Correo: {user.email}</Text>
          <Text style={styles.info}>🆔 ID: {user.id}</Text>
        </>
      ) : (
        <Text style={styles.info}>Cargando usuario...</Text>
      )}

      <View style={styles.button}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  info: { fontSize: 16, marginBottom: 10 },
  button: { marginTop: 30, width: '60%' },
});
