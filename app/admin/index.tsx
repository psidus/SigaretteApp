// File: app/admin/index.tsx
import { Redirect } from 'expo-router';
import MapComponent from '../components/MapView';

export default function AdminIndex() {
  // Appena entri nella cartella admin, ti sposta al login
  return <Redirect href="/admin/login" />;
}

