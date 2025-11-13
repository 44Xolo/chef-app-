import { DefaultTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6B35',
    accent: '#F7931E',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2D3436',
    error: '#E74C3C',
    success: '#27AE60',
    warning: '#F39C12',
    info: '#3498DB'
  },
  roundness: 12,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginVertical: 8,
    elevation: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  button: {
    marginVertical: 8,
    borderRadius: 12,
    paddingVertical: 8,
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FF6B35',
    marginVertical: 16,
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 22,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#FF6B35',
  },
  totalCount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#27AE60',
    textAlign: 'center' as const,
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#2D3436',
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 8,
  },
  emptyState: {
    textAlign: 'center' as const,
    marginTop: 80,
    color: '#7F8C8D',
    fontSize: 18,
    lineHeight: 24,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 8,
  },
  radioItem: {
    paddingVertical: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute' as const,
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B35',
  }
});
