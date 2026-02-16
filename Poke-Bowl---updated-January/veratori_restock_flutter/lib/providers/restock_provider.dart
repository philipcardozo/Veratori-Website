import 'dart:io';
import 'package:flutter/foundation.dart';
import '../services/api_service.dart';

class RestockProvider with ChangeNotifier {
  final ApiService _apiService;
  
  ApiService get apiService => _apiService;
  
  List<Map<String, dynamic>> _submissions = [];
  List<Map<String, dynamic>> _notifications = [];
  int _notificationCount = 0;
  bool _isLoading = false;
  
  RestockProvider({required ApiService apiService}) : _apiService = apiService {
    loadSubmissions();
    loadNotifications();
  }
  
  List<Map<String, dynamic>> get submissions => _submissions;
  List<Map<String, dynamic>> get notifications => _notifications;
  int get notificationCount => _notificationCount;
  bool get isLoading => _isLoading;
  
  Future<void> loadSubmissions() async {
    _isLoading = true;
    notifyListeners();
    
    _submissions = await _apiService.getSubmissions();
    
    _isLoading = false;
    notifyListeners();
  }
  
  Future<void> loadNotifications() async {
    _notifications = await _apiService.getNotifications();
    _notificationCount = await _apiService.getNotificationCount();
    notifyListeners();
  }
  
  Future<bool> markNotificationRead(String notificationId) async {
    final success = await _apiService.markNotificationRead(notificationId);
    if (success) {
      await loadNotifications();
    }
    return success;
  }
  
  Future<Map<String, dynamic>> submitRestock({
    required List<String> photoPaths,
    required String station,
    required String product,
    String? notes,
    Map<String, dynamic>? detectionResults,
    double? latitude,
    double? longitude,
  }) async {
    _isLoading = true;
    notifyListeners();
    
    // Convert paths to File objects
    final photos = photoPaths.map((path) => File(path)).toList();
    
    final result = await _apiService.submitRestock(
      photos: photos,
      station: station,
      product: product,
      notes: notes,
      detectionResults: detectionResults,
      latitude: latitude,
      longitude: longitude,
    );
    
    if (result['success'] == true) {
      await loadSubmissions();
    }
    
    _isLoading = false;
    notifyListeners();
    
    return result;
  }
}

