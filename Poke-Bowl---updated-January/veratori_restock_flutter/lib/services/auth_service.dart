import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService {
  final SharedPreferences prefs;
  final ApiService apiService;
  
  AuthService({required this.prefs, required this.apiService});
  
  Future<bool> login(String username, String password) async {
    final result = await apiService.login(username, password);
    
    if (result['success'] == true) {
      await prefs.setString('username', result['username'] ?? username);
      await prefs.setString('role', result['role'] ?? 'employee');
      await prefs.setString('franchise', result['franchise'] ?? 'f1');
      return true;
    }
    return false;
  }
  
  Future<bool> logout() async {
    final success = await apiService.logout();
    if (success) {
      await prefs.remove('username');
      await prefs.remove('role');
      await prefs.remove('franchise');
      await prefs.remove('session_token');
    }
    return success;
  }
  
  Future<bool> isAuthenticated() async {
    final sessionToken = prefs.getString('session_token');
    if (sessionToken == null) return false;
    
    final validation = await apiService.validateSession();
    return validation['valid'] == true;
  }
  
  String? getUsername() => prefs.getString('username');
  String? getRole() => prefs.getString('role');
  String? getFranchise() => prefs.getString('franchise');
}

