import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { AppDrawerContent } from './DrawerContent';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { VisitsScreen } from '../screens/VisitsScreen';
import { VisitDetailScreen } from '../screens/VisitDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { PlaceholderModuleScreen } from '../screens/PlaceholderModuleScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { AgendaScreen } from '../screens/AgendaScreen';
import { CustomersScreen } from '../screens/CustomersScreen';
import { IssuesScreen } from '../screens/IssuesScreen';
import { FreightAdjustmentsScreen } from '../screens/FreightAdjustmentsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerShell(): React.JSX.Element {
  const { bootstrap, theme } = useAuth();
  const items = bootstrap?.navigation.sections.flatMap((section) => section.items) ?? [];

  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        drawerType: 'front',
      }}
    >
      {items.map((item) => {
        const component = ({
          dashboard: DashboardScreen,
          visits: VisitsScreen,
          notifications: NotificationsScreen,
          agenda: AgendaScreen,
          customers: CustomersScreen,
          issues: IssuesScreen,
          priceAdjustments: FreightAdjustmentsScreen,
          profile: ProfileScreen,
          settings: SettingsScreen,
          help: HelpScreen,
          about: AboutScreen,
        } as Record<string, React.ComponentType<any>>)[item.screen] ?? PlaceholderModuleScreen;

        return (
          <Drawer.Screen
            key={item.id}
            name={item.screen}
            component={component}
            initialParams={{ module: item }}
            options={{
              title: item.label,
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  const { token } = useAuth();

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={DrawerShell} options={{ headerShown: false }} />
      <Stack.Screen name="VisitDetail" component={VisitDetailScreen} options={{ title: 'Detalhes da visita' }} />
    </Stack.Navigator>
  );
}
