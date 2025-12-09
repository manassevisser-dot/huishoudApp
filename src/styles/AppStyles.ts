
//======
// src/styles/AppStyles.ts

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  // NEW P2: Dark mode container
  containerDark: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  pageContainer: {
    flex: 1,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  
  // --- Headers ---
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1C1C1E',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#007AFF',
  },

  // --- Fields ---
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  labelError: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  numericWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    paddingHorizontal: 14,
  },
  currencyPrefix: {
    fontSize: 17,
    color: '#8E8E93',
    marginRight: 4,
  },
  numericInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 17,
    color: '#1C1C1E',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 6,
    fontSize: 13,
  },

  // --- Grid for Categories ---
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  gridItem: {
    width: '30%', // Approx 3 cols
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 8,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  gridItemSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  gridItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  gridItemTextSelected: {
    color: '#FFFFFF',
  },

  // --- Buttons ---
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F2F2F7',
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#E5E5EA',
    marginLeft: 0,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#1C1C1E',
    fontSize: 17,
    fontWeight: '600',
  },

  // --- Toggles & Chips ---
  toggleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#34C759',
  },
  toggleInactive: {
    backgroundColor: '#E5E5EA',
  },
  toggleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chipContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: '#E5E5EA',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  chipText: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // --- Dashboard ---
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dashboardLabel: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 8,
  },
  dashboardKPI: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 16,
  },
  dashboardMessage: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D1D6',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6E6E73',
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryDetail: {
    fontSize: 14,
    color: '#6E6E73',
    marginBottom: 20,
  },
});

export default styles;