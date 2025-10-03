import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AuraBackground from '@/components/AuraBackground';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import PaymentPage from '@/components/PaymentPage';
import PremiumScreen from '@/components/PremiumScreen';
import { useRevenueCat } from '@/components/RevenueCatProvider';
import BellIcon from '@/components/BellIcon';

export default function PayScreen() {
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showPremiumScreen, setShowPremiumScreen] = useState(false);
  const { isPremium, offerings } = useRevenueCat();

  return (
    <AuraBackground>
      <BellIcon />
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <ThemedText type="title" style={styles.title}>💳 Payment Center</ThemedText>
          
          {isPremium ? (
            // Premium User View
            <View style={styles.premiumSection}>
              <View style={styles.premiumBadge}>
                <LinearGradient
                  colors={['rgba(34, 139, 34, 0.8)', 'rgba(144, 238, 144, 0.6)']}
                  style={styles.premiumGradient}
                >
                  <ThemedText style={styles.premiumText}>✨ Premium Active</ThemedText>
                </LinearGradient>
              </View>
              
              <ThemedText style={styles.premiumDescription}>
                You have access to all premium features! Thank you for your support.
              </ThemedText>

              <PaymentOption
                icon="📋"
                title="Manage Subscription"
                description="View and manage your subscription settings"
                onPress={() => setShowPremiumScreen(true)}
              />

              <PaymentOption
                icon="📄"
                title="Billing History"
                description="View your payment history and receipts"
                onPress={() => {/* Add billing history */}}
              />
            </View>
          ) : (
            // Non-Premium User View
            <View style={styles.upgradeSection}>
              <ThemedText style={styles.upgradeTitle}>
                🚀 Unlock Premium Features
              </ThemedText>
              
              <ThemedText style={styles.upgradeDescription}>
                Get access to advanced features, priority support, and exclusive content.
              </ThemedText>

              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => setShowPremiumScreen(true)}
              >
                <LinearGradient
                  colors={['rgba(34, 139, 34, 0.8)', 'rgba(144, 238, 144, 0.6)']}
                  style={styles.upgradeGradient}
                >
                  <ThemedText style={styles.upgradeButtonText}>View Premium Plans</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Payment Options */}
          <View style={styles.paymentOptions}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Payment Options
            </ThemedText>

            <PaymentOption
              icon="📱"
              title="Quick Payment"
              description="Apple Pay, Google Pay, and more"
              onPress={() => setShowPaymentPage(true)}
            />

            <PaymentOption
              icon="💳"
              title="Card Payment"
              description="Pay with credit or debit card"
              onPress={() => setShowPaymentPage(true)}
            />

            <PaymentOption
              icon="🔄"
              title="Restore Purchases"
              description="Restore previous purchases"
              onPress={() => {/* Add restore functionality */}}
            />
          </View>

          {/* Security Info */}
          <View style={styles.securitySection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🔒 Security & Privacy
            </ThemedText>
            
            <View style={styles.securityCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(245, 245, 220, 0.05)']}
                style={styles.securityGradient}
              >
                <ThemedText style={styles.securityText}>
                  • All payments are processed securely through RevenueCat
                  {'\n'}• Your card information is never stored on our servers
                  {'\n'}• PCI DSS compliant payment processing
                  {'\n'}• 256-bit SSL encryption for all transactions
                </ThemedText>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>

        {/* Payment Page Modal */}
        <Modal
          visible={showPaymentPage}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <PaymentPage
            selectedPackage={offerings?.availablePackages[0] || null}
            onClose={() => setShowPaymentPage(false)}
            onPaymentSuccess={() => setShowPaymentPage(false)}
          />
        </Modal>

        {/* Premium Screen Modal */}
        <Modal
          visible={showPremiumScreen}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <PremiumScreen onClose={() => setShowPremiumScreen(false)} />
        </Modal>
      </ThemedView>
    </AuraBackground>
  );
}

interface PaymentOptionProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({ icon, title, description, onPress }) => (
  <TouchableOpacity style={styles.paymentOption} onPress={onPress}>
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.1)', 'rgba(245, 245, 220, 0.05)']}
      style={styles.optionGradient}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionHeader}>
          <ThemedText style={styles.optionIcon}>{icon}</ThemedText>
          <View style={styles.optionText}>
            <ThemedText style={styles.optionTitle}>{title}</ThemedText>
            <ThemedText style={styles.optionDescription}>{description}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.optionArrow}>›</ThemedText>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  premiumSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  premiumBadge: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  premiumGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  premiumText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  premiumDescription: {
    textAlign: 'center',
    fontSize: 16,
    color: '#34495e',
    marginBottom: 20,
    opacity: 0.8,
  },
  upgradeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 12,
  },
  upgradeDescription: {
    textAlign: 'center',
    fontSize: 16,
    color: '#34495e',
    marginBottom: 20,
    opacity: 0.8,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  upgradeGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  paymentOptions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  paymentOption: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#34495e',
    opacity: 0.7,
  },
  optionArrow: {
    fontSize: 20,
    color: '#7f8c8d',
  },
  securitySection: {
    marginTop: 20,
  },
  securityCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  securityGradient: {
    padding: 20,
  },
  securityText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    opacity: 0.8,
  },
});
