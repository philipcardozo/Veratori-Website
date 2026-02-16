import 'package:flutter/foundation.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService authService;
  
  bool _isAuthenticated = false;
  String? _username;
  String? _role;
  String? _franchise;
  
  AuthProvider({required this.authService}) {
    _checkAuth();
  }
  
  bool get isAuthenticated => _isAuthenticated;
  String? get username => _username;
  String? get role => _role;
  String? get franchise => _franchise;
  
  Future<void> _checkAuth() async {
    _isAuthenticated = await authService.isAuthenticated();
    if (_isAuthenticated) {
      _username = authService.getUsername();
      _role = authService.getRole();
      _franchise = authService.getFranchise();
    }
    notifyListeners();
  }
  
  Future<bool> login(String username, String password) async {
    final success = await authService.login(username, password);
    if (success) {
      _isAuthenticated = true;
      _username = authService.getUsername();
      _role = authService.getRole();
      _franchise = authService.getFranchise();
      notifyListeners();
    }
    return success;
  }
  
  Future<void> logout() async {
    await authService.logout();
    _isAuthenticated = false;
    _username = null;
    _role = null;
    _franchise = null;
    notifyListeners();
  }
}

