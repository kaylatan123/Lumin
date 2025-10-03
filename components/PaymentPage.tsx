import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import AuraBackground from './AuraBackground';
import { useRevenueCat } from './RevenueCatProvider';
import { PurchasesPackage } from 'react-native-purchases';
import * as Haptics from 'expo-haptics';

interface PaymentPageProps {
  selectedPackage?: PurchasesPackage | null;
  onClose?: () => void;
  onPaymentSuccess?: () => void;
}

interface CardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function PaymentPage({ selectedPackage, onClose, onPaymentSuccess }: PaymentPageProps) {
  const { purchasePackage, isLoading } = useRevenueCat();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'thirdParty'>('thirdParty');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Validate card information
  const validateCardInfo = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Card number validation (basic)
    const cardNumberClean = cardInfo.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean || cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    // Expiry date validation
    if (!cardInfo.expiryDate || cardInfo.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)';
    } else {
      const [month, year] = cardInfo.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!cardInfo.cvv || cardInfo.cvv.length < 3 || cardInfo.cvv.length > 4) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    // Cardholder name validation
    if (!cardInfo.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    // Billing address validation
    if (!cardInfo.billingAddress.street.trim()) {
      newErrors.street = 'Please enter street address';
    }
    if (!cardInfo.billingAddress.city.trim()) {
      newErrors.city = 'Please enter city';
    }
    if (!cardInfo.billingAddress.zipCode.trim()) {
      newErrors.zipCode = 'Please enter ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleThirdPartyPayment = async () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'No package selected');
      return;
    }

    try {
      setIsProcessing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const success = await purchasePackage(selectedPackage);
      
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onPaymentSuccess?.();
        onClose?.();
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Third-party payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!validateCardInfo()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // In a real app, you would integrate with a payment processor here
      // For now, we'll simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Payment Processing',
        'In a real implementation, this would process your card payment through a secure payment processor like Stripe, Square, or similar.',
        [
          {
            text: 'Simulate Success',
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success!', 'Payment processed successfully! 🎉');
              onPaymentSuccess?.();
              onClose?.();
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateCardInfo = (field: keyof CardInfo | string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCardInfo(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CardInfo] as object),
          [child]: value
        }
      }));
    } else {
      setCardInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AuraBackground>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.content}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Header */}
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>Payment</ThemedText>
              {selectedPackage && (
                <View style={styles.packageInfo}>
                  <ThemedText style={styles.packageTitle}>
                    {selectedPackage.product.title}
                  </ThemedText>
                  <ThemedText style={styles.packagePrice}>
                    {selectedPackage.product.priceString}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Payment Method Selection */}
            <View style={styles.methodSelection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Choose Payment Method
              </ThemedText>
              
              <View style={styles.methodButtons}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'thirdParty' && styles.selectedMethod
                  ]}
                  onPress={() => {
                    setPaymentMethod('thirdParty');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <LinearGradient
                    colors={
                      paymentMethod === 'thirdParty'
                        ? ['rgba(34, 139, 34, 0.3)', 'rgba(144, 238, 144, 0.2)']
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(245, 245, 220, 0.1)']
                    }
                    style={styles.methodGradient}
                  >
                    <Text style={styles.methodIcon}>📱</Text>
                    <ThemedText style={styles.methodText}>
                      Apple Pay / Google Pay
                    </ThemedText>
                    <ThemedText style={styles.methodSubtext}>
                      Secure & Fast
                    </ThemedText>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'card' && styles.selectedMethod
                  ]}
                  onPress={() => {
                    setPaymentMethod('card');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <LinearGradient
                    colors={
                      paymentMethod === 'card'
                        ? ['rgba(34, 139, 34, 0.3)', 'rgba(144, 238, 144, 0.2)']
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(245, 245, 220, 0.1)']
                    }
                    style={styles.methodGradient}
                  >
                    <Text style={styles.methodIcon}>💳</Text>
                    <ThemedText style={styles.methodText}>
                      Credit / Debit Card
                    </ThemedText>
                    <ThemedText style={styles.methodSubtext}>
                      Manual Entry
                    </ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Third-Party Payment Section */}
            {paymentMethod === 'thirdParty' && (
              <View style={styles.thirdPartySection}>
                <ThemedText style={styles.thirdPartyTitle}>
                  Quick & Secure Payment
                </ThemedText>
                <ThemedText style={styles.thirdPartyDescription}>
                  Use your device's secure payment system for the fastest checkout experience.
                </ThemedText>
                
                <View style={styles.thirdPartyMethods}>
                  {Platform.OS === 'ios' && (
                    <View style={styles.paymentMethodCard}>
                      <Text style={styles.paymentMethodIcon}>🍎</Text>
                      <ThemedText style={styles.paymentMethodName}>Apple Pay</ThemedText>
                    </View>
                  )}
                  
                  {Platform.OS === 'android' && (
                    <View style={styles.paymentMethodCard}>
                      <Text style={styles.paymentMethodIcon}>🇬</Text>
                      <ThemedText style={styles.paymentMethodName}>Google Pay</ThemedText>
                    </View>
                  )}
                  
                  <View style={styles.paymentMethodCard}>
                    <Text style={styles.paymentMethodIcon}>💰</Text>
                    <ThemedText style={styles.paymentMethodName}>PayPal</ThemedText>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.payButton}
                  onPress={handleThirdPartyPayment}
                  disabled={isProcessing || isLoading}
                >
                  <LinearGradient
                    colors={['rgba(34, 139, 34, 0.8)', 'rgba(144, 238, 144, 0.6)']}
                    style={styles.payButtonGradient}
                  >
                    {isProcessing || isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text style={styles.payButtonIcon}>
                          {Platform.OS === 'ios' ? '🍎' : '🇬'}
                        </Text>
                        <Text style={styles.payButtonText}>
                          Pay with {Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay'}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Card Payment Section */}
            {paymentMethod === 'card' && (
              <View style={styles.cardSection}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Card Information
                </ThemedText>

                {/* Card Number */}
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Card Number</ThemedText>
                  <TextInput
                    style={[styles.input, errors.cardNumber && styles.inputError]}
                    value={cardInfo.cardNumber}
                    onChangeText={(text) => updateCardInfo('cardNumber', formatCardNumber(text))}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <ThemedText style={styles.errorText}>{errors.cardNumber}</ThemedText>
                  )}
                </View>

                <View style={styles.cardRow}>
                  {/* Expiry Date */}
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <ThemedText style={styles.inputLabel}>Expiry Date</ThemedText>
                    <TextInput
                      style={[styles.input, errors.expiryDate && styles.inputError]}
                      value={cardInfo.expiryDate}
                      onChangeText={(text) => updateCardInfo('expiryDate', formatExpiryDate(text))}
                      placeholder="MM/YY"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <ThemedText style={styles.errorText}>{errors.expiryDate}</ThemedText>
                    )}
                  </View>

                  {/* CVV */}
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <ThemedText style={styles.inputLabel}>CVV</ThemedText>
                    <TextInput
                      style={[styles.input, errors.cvv && styles.inputError]}
                      value={cardInfo.cvv}
                      onChangeText={(text) => updateCardInfo('cvv', text.replace(/\D/g, ''))}
                      placeholder="123"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                    {errors.cvv && (
                      <ThemedText style={styles.errorText}>{errors.cvv}</ThemedText>
                    )}
                  </View>
                </View>

                {/* Cardholder Name */}
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Cardholder Name</ThemedText>
                  <TextInput
                    style={[styles.input, errors.cardholderName && styles.inputError]}
                    value={cardInfo.cardholderName}
                    onChangeText={(text) => updateCardInfo('cardholderName', text)}
                    placeholder="John Doe"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                  {errors.cardholderName && (
                    <ThemedText style={styles.errorText}>{errors.cardholderName}</ThemedText>
                  )}
                </View>

                {/* Billing Address */}
                <ThemedText type="subtitle" style={[styles.sectionTitle, styles.billingTitle]}>
                  Billing Address
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Street Address</ThemedText>
                  <TextInput
                    style={[styles.input, errors.street && styles.inputError]}
                    value={cardInfo.billingAddress.street}
                    onChangeText={(text) => updateCardInfo('billingAddress.street', text)}
                    placeholder="123 Main Street"
                    placeholderTextColor="#999"
                  />
                  {errors.street && (
                    <ThemedText style={styles.errorText}>{errors.street}</ThemedText>
                  )}
                </View>

                <View style={styles.addressRow}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <ThemedText style={styles.inputLabel}>City</ThemedText>
                    <TextInput
                      style={[styles.input, errors.city && styles.inputError]}
                      value={cardInfo.billingAddress.city}
                      onChangeText={(text) => updateCardInfo('billingAddress.city', text)}
                      placeholder="New York"
                      placeholderTextColor="#999"
                    />
                    {errors.city && (
                      <ThemedText style={styles.errorText}>{errors.city}</ThemedText>
                    )}
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <ThemedText style={styles.inputLabel}>ZIP Code</ThemedText>
                    <TextInput
                      style={[styles.input, errors.zipCode && styles.inputError]}
                      value={cardInfo.billingAddress.zipCode}
                      onChangeText={(text) => updateCardInfo('billingAddress.zipCode', text)}
                      placeholder="10001"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                    {errors.zipCode && (
                      <ThemedText style={styles.errorText}>{errors.zipCode}</ThemedText>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.payButton}
                  onPress={handleCardPayment}
                  disabled={isProcessing}
                >
                  <LinearGradient
                    colors={['rgba(34, 139, 34, 0.8)', 'rgba(144, 238, 144, 0.6)']}
                    style={styles.payButtonGradient}
                  >
                    {isProcessing ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text style={styles.payButtonIcon}>💳</Text>
                        <Text style={styles.payButtonText}>
                          Pay {selectedPackage?.product.priceString || 'Now'}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Close Button */}
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <ThemedText style={styles.closeText}>Cancel</ThemedText>
              </TouchableOpacity>
            )}

          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  packageInfo: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  methodSelection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  methodButtons: {
    gap: 12,
  },
  methodButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedMethod: {
    borderWidth: 2,
    borderColor: 'rgba(34, 139, 34, 0.5)',
  },
  methodGradient: {
    padding: 20,
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  methodSubtext: {
    fontSize: 14,
    color: '#34495e',
    opacity: 0.7,
  },
  thirdPartySection: {
    marginBottom: 30,
  },
  thirdPartyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  thirdPartyDescription: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  thirdPartyMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  paymentMethodCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    minWidth: 80,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  paymentMethodName: {
    fontSize: 12,
    color: '#34495e',
  },
  cardSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(52, 73, 94, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  billingTitle: {
    marginTop: 20,
  },
  payButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  payButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  closeText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
});