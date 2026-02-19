import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Landing: undefined;
  Dashboard: undefined;
  CsvUpload: undefined;
  WizardController: undefined;
  WizardScreen: { stepId: string }; // Als je params hebt
  // Add all your other screens here
};

export type AppNavigation = NavigationProp<RootStackParamList>;
export type AppRoute<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

export interface ScreenProps<T extends keyof RootStackParamList = keyof RootStackParamList> {
  navigation: AppNavigation;
  route: AppRoute<T>;
}