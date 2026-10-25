import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 28,
    padding: 26,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#1e1b4b',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e1b4b',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  tagPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  tagPillSelected: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  tagPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  tagPillTextSelected: {
    color: '#4338ca',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    minHeight: 110,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
