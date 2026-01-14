import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { ArrowLeft, Lock, UserPlus } from 'lucide-react-native';
import { z } from 'zod';
import { router } from 'expo-router';  // Add this import for navigation
// Importa i tuoi componenti UI personalizzati (quelli creati prima)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Importa la configurazione degli admin
import { checkAdminCredentials } from '../../config/admins';

interface AdminLoginProps {
  onBack?: () => void;
  onLoginSuccess?: () => void;
} 

// Schema di validazione Zod
const authSchema = z.object({
  email: z.string().email('Email non valida').max(255),
  password: z.string().min(6, 'La password deve essere di almeno 6 caratteri').max(100),
});

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLoginSuccess }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle tra Login e Registrazione

  const onBack = () => {
      // Torna alla home principale dell'app
      router.replace('/');
  };

  const handleSubmit = async () => {
    // 1. Validazione Input con Zod
    const result = authSchema.safeParse({ email, password });
    
    if (!result.success) {
      Alert.alert('Errore Validazione', result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    // Simuliamo un ritardo di rete per realismo
    setTimeout(() => {
      try {
        if (isSignUp) {
          // --- LOGICA REGISTRAZIONE (Simulata) ---
          // Nota: In questo sistema basato su file, non possiamo davvero "registrare" nuovi admin permanentemente
          // senza un database. Qui mostriamo solo un messaggio.
          Alert.alert(
            'Richiesta Inviata', 
            'La registrazione admin richiede approvazione manuale. Contatta il proprietario.'
          );
          setIsSignUp(false); // Torna al login
        } else {
          // --- LOGICA LOGIN ---
          const authResult = checkAdminCredentials(email, password);

          if (authResult.success && authResult.user) {
            // 2. SUCCESSO!
            // Invece di onLoginSuccess, navighiamo direttamente
            
            Alert.alert('Benvenuto', `Ciao ${authResult.user.name}`, [
              {
                text: 'OK', 
                onPress: () => {
                  // 3. Reindirizza alla Dashboard
                  // Usiamo 'replace' invece di 'push' così l'utente non può 
                  // tornare al login premendo "indietro"
                  router.replace('/admin/dashboard');
                }
              }
            ]);
          } else {
            Alert.alert('Accesso Negato', 'Email o password non corrette.');
          }
        }
      } catch (error) {
        Alert.alert('Errore', 'Qualcosa è andato storto.');
      } finally {
        setIsLoading(false);
      }
    }, 1000); // 1 secondo di attesa finta
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.contentContainer}>
          {/* Tasto Indietro */}
          <Button
            variant="ghost"
            onPress={onBack}
            style={styles.backButton}
          >
            <ArrowLeft size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <Text style={{ color: '#94A3B8' }}>Torna alla mappa</Text>
          </Button>

          <Card style={styles.loginCard}>
            <CardHeader style={styles.centerHeader}>
              <View style={styles.iconContainer}>
                {isSignUp ? (
                  <UserPlus size={24} color="#007AFF" />
                ) : (
                  <Lock size={24} color="#007AFF" />
                )}
              </View>
              <CardTitle style={styles.title}>
                {isSignUp ? 'Crea Account' : 'Admin Access'}
              </CardTitle>
              <CardDescription style={styles.description}>
                {isSignUp 
                  ? 'Registrati per richiedere accesso' 
                  : 'Accedi per gestire i luoghi sulla mappa'
                }
              </CardDescription>
            </CardHeader>

            <CardContent style={{ gap: 16 }}>
              {/* Form Email */}
              <View>
                <Label>Email</Label>
                <Input
                  placeholder="admin@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Form Password */}
              <View>
                <Label>Password</Label>
                <Input
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Submit Button */}
              <Button 
                onPress={handleSubmit}
                disabled={isLoading}
                style={styles.submitButton}
              >
                {isLoading 
                  ? 'Attendere...' 
                  : (isSignUp ? 'Crea Account' : 'Accedi')
                }
              </Button>

              {/* Toggle Login/Sign Up */}
              <TouchableOpacity 
                onPress={() => setIsSignUp(!isSignUp)}
                style={styles.toggleContainer}
              >
                <Text style={styles.toggleText}>
                  {isSignUp 
                    ? "Hai già un account? Accedi" 
                    : "Non hai un account? Registrati"
                  }
                </Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Sfondo scuro (Slate 900)
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  contentContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  loginCard: {
    borderColor: '#1E293B', // Slate 800
    backgroundColor: 'rgba(30, 41, 59, 0.7)', // Effetto semi-trasparente
    borderWidth: 1,
    // Ombre simulata per effetto "Neon"
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  centerHeader: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)', // Primary con opacità
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: '#F8FAFC', // Slate 50
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: '#94A3B8', // Slate 400
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#007AFF',
  },
  toggleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#38BDF8', // Colore ciano/blu chiaro
    fontSize: 14,
  }
});

export default AdminLogin;