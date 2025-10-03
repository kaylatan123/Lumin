import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL,
  PurchasesError,
} from 'react-native-purchases';
import { Platform, Alert } from 'react-native';

// RevenueCat API Keys - Replace with your actual keys
const API_KEYS = {
  apple: 'your_apple_api_key_here',
  google: 'your_google_api_key_here',
};

interface RevenueCatContextType {
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  isLoading: boolean;
  isPremium: boolean;
  purchasePackage: (packageToBuy: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  getUserInfo: () => Promise<CustomerInfo | null>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
};

interface RevenueCatProviderProps {
  children: ReactNode;
}

export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      // Configure RevenueCat
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      
      // Initialize with the appropriate API key
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: API_KEYS.apple });
      } else if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: API_KEYS.google });
      }

      // Get initial customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Get offerings
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setOfferings(offerings.current);
      }

      // Set up listener for customer info updates
      Purchases.addCustomerInfoUpdateListener((info) => {
        setCustomerInfo(info);
      });

    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = () => {
    return customerInfo?.entitlements.active['premium'] !== undefined;
  };

  const purchasePackage = async (packageToBuy: PurchasesPackage): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      setCustomerInfo(customerInfo);
      
      if (customerInfo.entitlements.active['premium']) {
        Alert.alert('Success!', 'Welcome to Premium! 🎉');
        return true;
      } else {
        Alert.alert('Error', 'Purchase failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
        Alert.alert('Purchase Error', error.message || 'Something went wrong');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const customerInfo = await Purchases.restorePurchases();
      setCustomerInfo(customerInfo);
      
      if (customerInfo.entitlements.active['premium']) {
        Alert.alert('Success!', 'Purchases restored successfully! 🎉');
        return true;
      } else {
        Alert.alert('No Purchases', 'No active purchases found to restore.');
        return false;
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      Alert.alert('Restore Error', error.message || 'Failed to restore purchases');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (): Promise<CustomerInfo | null> => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('Error getting customer info:', error);
      return null;
    }
  };

  const value: RevenueCatContextType = {
    customerInfo,
    offerings,
    isLoading,
    isPremium: isPremium(),
    purchasePackage,
    restorePurchases,
    getUserInfo,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};