import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import AuraBackground from './AuraBackground';
import PaymentPage from './PaymentPage';
import { useRevenueCat } from './RevenueCatProvider';
import { PurchasesPackage } from 'react-native-purchases';

const { width: screenWidth } = Dimensions.get('window');

interface PremiumScreenProps {
  onClose?: () => void;
}

export default function PremiumScreen({ onClose }: PremiumScreenProps) {
  const { offerings, isLoading, restorePurchases, isPremium } = useRevenueCat();
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  const handlePurchase = async () => {
    if (selectedPackage) {
      setShowPaymentPage(true);
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success && onClose) {
      onClose();
    }
  };

  if (isPremium) {
    return (
      <AuraBackground>
        <ThemedView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedText type="title" style={styles.title}>
              🎉 You're Premium!
            </ThemedText>
            <ThemedText style={styles.description}>
              Thank you for supporting our app! You have access to all premium features.
            </ThemedText>
            
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <LinearGradient
                  colors={['rgba(34, 139, 34, 0.8)', 'rgba(144, 238, 144, 0.6)']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </ScrollView>
        </ThemedView>
      </AuraBackground>
    );
  }

  return (
    <AuraBackground>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <ThemedText type="title" style={styles.title}>
            ✨ Go Premium
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Unlock all features and support development
          </ThemedText>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <FeatureItem
              icon="🚀"
              title="Unlimited Access"
              description="Access all premium features without limits"
            />
            <FeatureItem
              icon="🎯"
              title="Advanced Features"
              description="Get access to advanced matching algorithms"
            />
            <FeatureItem
              icon="💬"
              title="Priority Support"
              description="Get help faster with priority customer support"
            />
            <FeatureItem
              icon="🔔"
              title="Premium Notifications"
              description="Custom notification sounds and advanced settings"
            />
            <FeatureItem
              icon="🎨"
              title="Exclusive Themes"
              description="Access beautiful premium themes and customizations"
            />
          </View>

          {/* Subscription Options */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#34C759" />
              <ThemedText style={styles.loadingText}>Loading plans...</ThemedText>
            </View>
          ) : offerings ? (
            <View style={styles.packagesContainer}>
              <ThemedText type="subtitle" style={styles.packagesTitle}>
                Choose Your Plan
              </ThemedText>
              
              {offerings.availablePackages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.packageOption,
                    selectedPackage?.identifier === pkg.identifier && styles.selectedPackage,
                  ]}
                  onPress={() => setSelectedPackage(pkg)}
                >
                  <LinearGradient
                    colors={
                      selectedPackage?.identifier === pkg.identifier
                        ? ['rgba(34, 139, 34, 0.3)', 'rgba(144, 238, 144, 0.2)']
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(245, 245, 220, 0.1)']
                    }
                    style={styles.packageGradient}
                  >
                    <View style={styles.packageContent}>
                      <ThemedText type="defaultSemiBold" style={styles.packageTitle}>
                        {pkg.product.title}
                      </ThemedText>
                      <ThemedText style={styles.packagePrice}>
                        {pkg.product.priceString}
                      </ThemedText>
                      <ThemedText style={styles.packageDescription}>
                        {pkg.product.description}
                      </ThemedText>
                    </View>
                    {selectedPackage?.identifier === pkg.identifier && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <ThemedText style={styles.noOfferings}>
              No subscription plans available at the moment.
            </ThemedText>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {selectedPackage && (
              <TouchableOpacity
                onPress={handlePurchase}
                style={styles.purchaseButton}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['rgba(34, 139, 34, 0.8)', 'rgba(144, 238, 144, 0.6)']}
                  style={styles.gradientButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>
                      Subscribe for {selectedPackage.product.priceString}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleRestore}
              style={styles.restoreButton}
              disabled={isLoading}
            >
              <Text style={styles.restoreText}>
                Restore Purchases
              </Text>
            </TouchableOpacity>

            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Maybe Later</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Terms */}
          <ThemedText style={styles.terms}>
            Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
          </ThemedText>
        </ScrollView>

        {/* Payment Modal */}
        <Modal
          visible={showPaymentPage}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <PaymentPage
            selectedPackage={selectedPackage}
            onClose={() => setShowPaymentPage(false)}
            onPaymentSuccess={() => {
              setShowPaymentPage(false);
              onClose?.();
            }}
          />
        </Modal>
      </ThemedView>
    </AuraBackground>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureContent}>
      <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.featureDescription}>
        {description}
      </ThemedText>
    </View>
  </View>
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
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#34495e',
    opacity: 0.8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#34495e',
    opacity: 0.8,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  featureDescription: {
    fontSize: 14,
    color: '#34495e',
    opacity: 0.7,
  },
  packagesContainer: {
    marginBottom: 30,
  },
  packagesTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  packageOption: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedPackage: {
    borderWidth: 2,
    borderColor: 'rgba(34, 139, 34, 0.5)',
  },
  packageGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageContent: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 18,
    marginBottom: 4,
    color: '#2c3e50',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#27ae60',
  },
  packageDescription: {
    fontSize: 14,
    color: '#34495e',
    opacity: 0.7,
  },
  selectedIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#34495e',
  },
  noOfferings: {
    textAlign: 'center',
    color: '#34495e',
    fontSize: 16,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  purchaseButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeText: {
    color: '#34495e',
    fontSize: 16,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 20,
    lineHeight: 16,
  },
});