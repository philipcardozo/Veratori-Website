import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'providers/auth_provider.dart';
import 'providers/restock_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services
  final prefs = await SharedPreferences.getInstance();
  final apiService = ApiService();
  final authService = AuthService(prefs: prefs, apiService: apiService);
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(authService: authService)),
        ChangeNotifierProvider(create: (_) => RestockProvider(apiService: apiService)),
      ],
      child: const VeratoriRestockApp(),
    ),
  );
}

class VeratoriRestockApp extends StatelessWidget {
  const VeratoriRestockApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Veratori Restock',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        primaryColor: const Color(0xFF10B981),
        scaffoldBackgroundColor: const Color(0xFF070B12),
        cardColor: const Color(0xFF111827),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0B1120),
          elevation: 0,
          iconTheme: IconThemeData(color: Color(0xFFF1F5F9)),
          titleTextStyle: TextStyle(
            color: Color(0xFFF1F5F9),
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(color: Color(0xFFF1F5F9)),
          bodyMedium: TextStyle(color: Color(0xFF94A3B8)),
          bodySmall: TextStyle(color: Color(0xFF64748B)),
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF10B981),
          secondary: Color(0xFF3B82F6),
          surface: Color(0xFF1A2332),
          error: Color(0xFFEF4444),
        ),
      ),
      home: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          if (authProvider.isAuthenticated) {
            return const HomeScreen();
          }
          return const LoginScreen();
        },
      ),
    );
  }
}

