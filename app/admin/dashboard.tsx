import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Image as ImageIcon, AlertCircle, Trash2 } from 'lucide-react-native';

// --- IMPORT COMPONENTI UI (I tuoi percorsi) ---
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Place, PlaceCategory, CATEGORY_CONFIG } from '@/types/places';

// --- TIPI ---
interface FormData {
  name: string;
  description: string;
  image_url: string;
  lat: string;
  lng: string;
  address: string;
  open_time: string;
  close_time: string;
  categories: PlaceCategory[];
}

const AdminDashboard = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Per il caricamento iniziale
  const [places, setPlaces] = useState<Place[]>([]); // Array vuoto iniziale
  const isAdmin = true; // Hardcoded per ora

  // State del form
  const [formData, setFormData] = useState<FormData>({
    name: '', description: '', image_url: '', lat: '', lng: '', address: '', open_time: '', close_time: '', categories: [],
  });

  // 1️⃣ LOAD: Funzione per caricare i dati (Future Database Fetch)
  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setIsLoading(true);
      // TODO: DATABASE - Qui in futuro metterai: const { data } = await supabase.from('places').select('*');

      // Simuliamo un ritardo di rete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Dati finti per testare la lista (puoi cancellarli quando colleghi il DB)
      const mockData: Place[] = [];
      setPlaces(mockData);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare i luoghi');
    } finally {
      setIsLoading(false);
    }
  };

  // 2️⃣ CREATE: Funzione per salvare (Future Database Insert)
  const savePlaceToDB = async (newPlaceData: Omit<Place, 'id' | 'created_at' | 'updated_at'>) => {
    // TODO: DATABASE - Qui in futuro: const { data } = await supabase.from('places').insert(newPlaceData).select();

    // Simulazione salvataggio locale
    const savedPlace: Place = {
      ...newPlaceData,
      id: Math.random().toString(), // ID temporaneo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Aggiorna lo stato locale aggiungendo il nuovo
    setPlaces(prev => [...prev, savedPlace]);
    return savedPlace;
  };

  // 3️⃣ DELETE: Funzione per cancellare (Future Database Delete)
  const deletePlaceFromDB = async (placeId: string) => {
    // TODO: DATABASE - Qui in futuro: await supabase.from('places').delete().eq('id', placeId);

    // Rimuovi dallo stato locale
    setPlaces(prev => prev.filter(p => p.id !== placeId));
  };

  // --- GESTIONE FORM E UI ---

  const handleCategoryToggle = (category: PlaceCategory) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Elimina Luogo",
      `Sei sicuro di voler eliminare "${name}"?`,
      [
        { text: "Annulla", style: "cancel" },
        { text: "Elimina", style: "destructive", onPress: () => deletePlaceFromDB(id) }
      ]
    );
  };

  const handleSubmit = async () => {
    // Validazioni
    if (formData.categories.length === 0) return Alert.alert('Errore', 'Seleziona una categoria');
    if (!formData.lat || !formData.lng) return Alert.alert('Errore', 'Inserisci coordinate');

    setIsSubmitting(true);

    try {
      const placeToSave = {
        name: formData.name,
        description: formData.description || null,
        image_url: formData.image_url || null,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        categories: formData.categories,
        open_time: formData.open_time.includes(':') ? formData.open_time + ':00' : '00:00:00',
        close_time: formData.close_time.includes(':') ? formData.close_time + ':00' : '00:00:00',
        address: formData.address || null,
      };

      await savePlaceToDB(placeToSave);

      Alert.alert('Successo', 'Luogo aggiunto!');
      // Reset Form
      setFormData({
        name: '', description: '', image_url: '', lat: '', lng: '', address: '', open_time: '', close_time: '', categories: [],
      });
    } catch (error) {
      Alert.alert('Errore', 'Salvataggio fallito');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLogout = () => {
    router.replace('/admin/login');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Button variant="ghost" onPress={onLogout} style={styles.backButton}>
            <ArrowLeft size={16} color="#64748B" style={{ marginRight: 8 }} />
            <Text style={{ color: '#64748B' }}>Logout</Text>
          </Button>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>

        {/* FORM SECTION */}
        <Card style={styles.formCard}>
          <CardHeader>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Plus size={20} color="#007AFF" />
              <CardTitle>Aggiungi Luogo</CardTitle>
            </View>
            <CardDescription>Nuova location</CardDescription>
          </CardHeader>

          <CardContent style={{ gap: 16 }}>
            {/* INPUT CAMPI */}
            <View><Label>Nome *</Label><Input value={formData.name} onChangeText={(t) => setFormData(p => ({ ...p, name: t }))} /></View>
            <View><Label>Descrizione</Label><Textarea value={formData.description} onChangeText={(t) => setFormData(p => ({ ...p, description: t }))} /></View>
            <View><Label>URL Immagine</Label><Input value={formData.image_url} onChangeText={(t) => setFormData(p => ({ ...p, image_url: t }))} /></View>

            <View style={styles.rowGrid}>
              <View style={{ flex: 1 }}><Label>Lat *</Label><Input keyboardType="numeric" value={formData.lat} onChangeText={(t) => setFormData(p => ({ ...p, lat: t }))} /></View>
              <View style={{ flex: 1 }}><Label>Lng *</Label><Input keyboardType="numeric" value={formData.lng} onChangeText={(t) => setFormData(p => ({ ...p, lng: t }))} /></View>
            </View>

            <View style={styles.rowGrid}>
              <View style={{ flex: 1 }}><Label>Apertura</Label><Input placeholder="HH:MM" value={formData.open_time} onChangeText={(t) => setFormData(p => ({ ...p, open_time: t }))} /></View>
              <View style={{ flex: 1 }}><Label>Chiusura</Label><Input placeholder="HH:MM" value={formData.close_time} onChangeText={(t) => setFormData(p => ({ ...p, close_time: t }))} /></View>
            </View>

            {/* CATEGORIE */}
            <View>
              <Label style={{marginBottom:8}}>Categorie *</Label>
              <View style={styles.categoriesGrid}>
                {(Object.entries(CATEGORY_CONFIG) as [PlaceCategory, typeof CATEGORY_CONFIG[PlaceCategory]][]).map(([cat, conf]) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryItem, formData.categories.includes(cat) && styles.categoryItemSelected]}
                        onPress={() => handleCategoryToggle(cat)}
                    >
                        <Checkbox checked={formData.categories.includes(cat)} onCheckedChange={() => handleCategoryToggle(cat)} />
                        <Text style={styles.categoryIcon}>{conf.icon}</Text>
                        <Text style={styles.categoryLabel}>{conf.label}</Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button onPress={handleSubmit} disabled={isSubmitting} style={{ marginTop: 10 }}>
              {isSubmitting ? 'Salvataggio...' : 'Aggiungi Luogo'}
            </Button>
          </CardContent>
        </Card>

        {/* LISTA LUOGHI ESISTENTI */}
        <Card style={{ marginBottom: 40 }}>
          <CardHeader><CardTitle>Luoghi ({places.length})</CardTitle></CardHeader>
          <CardContent>
             {isLoading ? (
                <Text style={styles.emptyText}>Caricamento...</Text>
             ) : places.length === 0 ? (
                <Text style={styles.emptyText}>Nessun luogo presente</Text>
             ) : (
               <View style={{ gap: 10 }}>
                 {places.map((place) => (
                   <View key={place.id} style={styles.placeItem}>
                     <View style={{flex: 1}}>
                       <Text style={styles.placeName}>{place.name}</Text>
                       <Text style={styles.placeTime}>{place.open_time.slice(0, 5)} - {place.close_time.slice(0, 5)}</Text>
                     </View>

                     {/* Tasto Cancella */}
                     <TouchableOpacity onPress={() => handleDelete(place.id, place.name)} style={{ padding: 8 }}>
                        <Trash2 size={20} color="#EF4444" />
                     </TouchableOpacity>
                   </View>
                 ))}
               </View>
             )}
          </CardContent>
        </Card>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC', // O background scuro se preferisci
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#020817',
  },
  warningCard: {
    borderColor: '#F59E0B', // Warning color
    borderWidth: 1,
    backgroundColor: '#FFFBEB',
    marginBottom: 20,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  warningTitle: {
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 2,
  },
  warningText: {
    fontSize: 12,
    color: '#B45309',
  },
  formCard: {
    marginBottom: 24,
  },
  rowGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  iconInputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9', // muted
    borderWidth: 1,
    borderColor: 'transparent',
    width: '48%', // Circa 2 colonne
  },
  categoryItemSelected: {
    backgroundColor: '#EFF6FF', // bg-primary/10
    borderColor: '#007AFF',
  },
  categoryIcon: {
    marginLeft: 8,
    marginRight: 4,
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#0F172A',
  },
  disabled: {
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    padding: 20,
  },
  placeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  placeName: {
    fontWeight: '600',
    color: '#020817',
  },
  placeTime: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default AdminDashboard;