import { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../src/context/AuthContext';

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function Register() {
  const router = useRouter();
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const [emailError, setEmailError] = useState(''); // Error en el correo
  const [passwordError, setPasswordError] = useState(''); // Error en la contraseña
  const [usernameError, setUsernameError] = useState(''); // Error en el nombre

  const handleRegister = async () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');
    setUsernameError('');

    // Validación de los campos
    if (!username) {
      setUsernameError('Por favor ingresa un nombre de usuario.');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Registro del usuario
      await register(username, email, password);
      Alert.alert('¡Éxito!', 'Registro exitoso. Ahora te redirigiremos al lobby.');

      // Redirigir al lobby después de un registro exitoso
      router.replace('/lobby');
    } catch (err) {
      setLoading(false);

      // Mostrar mensaje si ya existe el correo
      if (err?.response?.data?.message === 'Email ya registrado') {
        Alert.alert('¡Ya estás registrado!', 'Este correo ya está en uso. ¿Quieres iniciar sesión?');
        router.push('/login');
      } else {
        Alert.alert('Error', err?.response?.data?.message || 'Hubo un error al registrar el usuario');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, usernameError ? styles.inputError : null]}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

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

      <Button title="Registrarse" onPress={handleRegister} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <Text style={styles.link} onPress={() => router.push('/login')}>
        ¿Ya tienes cuenta? Inicia sesión
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
