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
import { useRouter } from 'expo-router'; // CORRETTO: Importa useRouter

// Importa i componenti UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// CORRETTO: Usa l'alias @ oppure il percorso relativo corretto
import { supabase } from '../../lib/superbase';
// Se questo ti da errore, prova: import { supabase } from '../../lib/supabase';

interface AdminLoginProps {
  onBack?: () => void;
  onLoginSuccess?: () => void;
}

const authSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(6, 'Minimo 6 caratteri'),
});

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack: propOnBack }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Gestione del tasto indietro
  const handleBack = () => {
    if (propOnBack) {
      propOnBack();
    } else {
      router.replace('/');
    }
  };

  const handleSubmit = async () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      Alert.alert('Errore', result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Registrazione su Supabase
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert('Successo', 'Controlla la tua email per confermare l\'account.');
        setIsSignUp(false);
      } else {
        // Login su Supabase
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Navigazione alla dashboard
        router.replace('/admin/dashboard');
      }
    } catch (error: any) {
      Alert.alert('Errore Autenticazione', error.message || 'Verifica le credenziali');
    } finally {
      setIsLoading(false);
    }
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
            onPress={handleBack} // CORRETTO: Usa handleBack, non onBack
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
    backgroundColor: '#0F172A',
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
    borderColor: '#1E293B',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderWidth: 1,
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
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: '#F8FAFC',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: '#94A3B8',
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
    color: '#38BDF8',
    fontSize: 14,
  }
});

export default AdminLogin;