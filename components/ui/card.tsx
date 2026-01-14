import React from 'react';
import { View, Text, StyleSheet, Platform, ViewProps, TextProps } from 'react-native';

// --- STILI BASE ---
const styles = StyleSheet.create({
  // CARD (Contenitore principale)
  card: {
    backgroundColor: '#FFFFFF', // bg-card
    borderRadius: 8,            // rounded-lg
    borderWidth: 1,             // border
    borderColor: '#E5E7EB',     // border-border (grigio chiaro)
    
    // Gestione Ombre (shadow-sm)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // HEADER (Contenitore Titolo + Descrizione)
  header: {
    padding: 24,       // p-6
    flexDirection: 'column',
    gap: 6,            // space-y-1.5 (circa 6px)
  },

  // TITLE (h3)
  title: {
    fontSize: 24,      // text-2xl
    fontWeight: '600', // font-semibold
    lineHeight: 24,    // leading-none
    letterSpacing: -0.5, // tracking-tight
    color: '#020817',  // text-foreground
  },

  // DESCRIPTION (p)
  description: {
    fontSize: 14,      // text-sm
    color: '#64748B',  // text-muted-foreground
  },

  // CONTENT (Il corpo della card)
  content: {
    paddingHorizontal: 24, // p-6 (lati)
    paddingBottom: 24,     // p-6 (fondo)
    paddingTop: 0,         // pt-0 (perché l'header ha già padding sotto)
  },

  // FOOTER (Bottoni o azioni in fondo)
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24, // p-6
    paddingBottom: 24,     // p-6
    paddingTop: 0,         // pt-0
  },
});

// --- COMPONENTI ---

interface CardProps extends ViewProps {}
const Card = React.forwardRef<View, CardProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = "Card";

interface CardHeaderProps extends ViewProps {}
const CardHeader = React.forwardRef<View, CardHeaderProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.header, style]} {...props} />
));
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends TextProps {}
const CardTitle = React.forwardRef<Text, CardTitleProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.title, style]} {...props} />
));
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends TextProps {}
const CardDescription = React.forwardRef<Text, CardDescriptionProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.description, style]} {...props} />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends ViewProps {}
const CardContent = React.forwardRef<View, CardContentProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.content, style]} {...props} />
));
CardContent.displayName = "CardContent";

interface CardFooterProps extends ViewProps {}
const CardFooter = React.forwardRef<View, CardFooterProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.footer, style]} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

//COME USARE LA CARD:
/* import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Label } from './components/Label';

export default function LoginCardScreen() {
  return (
    <View style={styles.container}>
      
      <Card>
        <CardHeader>
          <CardTitle>Accedi</CardTitle>
          <CardDescription>
            Inserisci le tue credenziali per entrare nell'app.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Usiamo un gap verticale per separare i campi }
          <View style={{ gap: 15 }}>
            <View>
              <Label>Email</Label>
              <Input placeholder="mario.rossi@esempio.com" keyboardType="email-address" />
            </View>
            
            <View>
              <Label>Password</Label>
              <Input placeholder="••••••••" secureTextEntry />
            </View>
          </View>
        </CardContent>
        
        <CardFooter style={{ flexDirection: 'column', gap: 10 }}>
          {/* I bottoni occupano tutta la larghezza}
          <View style={{ width: '100%' }}>
            <Button onPress={() => alert('Login')}>Accedi</Button>
          </View>
          <View style={{ width: '100%' }}>
            <Button variant="ghost">Password dimenticata?</Button>
          </View>
        </CardFooter>
      </Card>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC', // Sfondo leggermente grigio per far risaltare la card bianca
  },
}); */