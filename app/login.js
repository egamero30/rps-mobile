import { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../src/context/AuthContext';

// Función para validar el correo electrónico
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const [emailError, setEmailError] = useState(''); // Error en el correo
  const [passwordError, setPasswordError] = useState(''); // Error en la contraseña

  const handleLogin = async () => {
    // Validación de correo electrónico
    setEmailError('');
    setPasswordError('');
    if (!isValidEmail(email)) {
      setEmailError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      Alert.alert('Bienvenido', `Hola ${email} 👋`);
      router.replace('/lobby');
    } catch (err) {
      setLoading(false);

      // Mostrar un mensaje claro dependiendo del error
      if (err?.response?.data?.message === 'Usuario no encontrado') {
        Alert.alert(
          '¡No registrado!',
          'Parece que no tenemos una cuenta con ese correo. ¿Quieres registrarte?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sí, registrarme', onPress: () => router.push('/register') },
          ]
        );
      } else if (err?.response?.data?.message === 'Contraseña incorrecta') {
        setPasswordError('La contraseña que ingresaste es incorrecta. ¿Olvidaste tu contraseña?');
        // Podrías agregar aquí un enlace a la recuperación de contraseña más adelante.
      } else {
        Alert.alert('Error', err?.response?.data?.message || 'Error al iniciar sesión');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, emailError ? styles.inputError : null]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, passwordError ? styles.inputError : null]}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <Button title="Ingresar" onPress={handleLogin} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <Text style={styles.link} onPress={() => router.push('/register')}>
        ¿No tienes cuenta? ¡Regístrate ahora! 🚀
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
  inputError: { borderColor: 'red' }, // Bordes rojos si hay error
  errorText: { color: 'red', fontSize: 12, marginBottom: 5 }, // Mensajes de error en rojo
  link: { marginTop: 15, color: 'blue', textAlign: 'center', fontSize: 16 },
});
