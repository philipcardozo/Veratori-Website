import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  late Dio _dio;
  String? _baseUrl;
  SharedPreferences? _prefs;
  
  ApiService({String? baseUrl, SharedPreferences? prefs}) {
    _baseUrl = baseUrl ?? 'http://localhost:8080';
    _prefs = prefs;
    
    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl!,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    
    // Add interceptor for session cookie handling
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Get session cookie from storage
        final sessionToken = await _getSessionToken();
        if (sessionToken != null) {
          options.headers['Cookie'] = 'pb_session=$sessionToken';
        }
        handler.next(options);
      },
      onResponse: (response, handler) {
        // Extract and store session cookie from response
        final cookies = response.headers.value('set-cookie');
        if (cookies != null) {
          final sessionMatch = RegExp(r'pb_session=([^;]+)').firstMatch(cookies);
          if (sessionMatch != null) {
            _saveSessionToken(sessionMatch.group(1)!);
          }
        }
        handler.next(response);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Clear session on unauthorized
          _clearSessionToken();
        }
        handler.next(error);
      },
    ));
  }
  
  Future<String?> _getSessionToken() async {
    return _prefs?.getString('session_token');
  }
  
  Future<void> _saveSessionToken(String token) async {
    await _prefs?.setString('session_token', token);
  }
  
  Future<void> _clearSessionToken() async {
    await _prefs?.remove('session_token');
  }
  
  // Authentication
  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _dio.post(
        '/api/restock/login',
        data: {
          'username': username,
          'password': password,
        },
        options: Options(
          followRedirects: false,
          validateStatus: (status) => status! < 500,
        ),
      );
      
      if (response.statusCode == 200 && response.data['success'] == true) {
        // Extract session from Set-Cookie header
        final cookies = response.headers.value('set-cookie');
        if (cookies != null) {
          final sessionMatch = RegExp(r'pb_session=([^;]+)').firstMatch(cookies);
          if (sessionMatch != null) {
            await _saveSessionToken(sessionMatch.group(1)!);
          }
        }
        
        return {
          'success': true,
          'username': response.data['username'] ?? username,
          'role': response.data['role'] ?? 'employee',
          'franchise': response.data['franchise'] ?? 'f1',
        };
      } else {
        return {
          'success': false,
          'message': response.data['message'] ?? 'Login failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }
  
  Future<bool> logout() async {
    try {
      await _dio.post('/api/restock/logout');
      await _clearSessionToken();
      return true;
    } catch (e) {
      await _clearSessionToken();
      return false;
    }
  }
  
  Future<Map<String, dynamic>> validateSession() async {
    try {
      final response = await _dio.post(
        '/api/restock/validate',
        data: {},
      );
      
      if (response.statusCode == 200 && response.data['valid'] == true) {
        return {
          'valid': true,
          'username': response.data['username'],
        };
      }
      return {'valid': false};
    } catch (e) {
      return {'valid': false};
    }
  }
  
  // YOLO Detection (preview before submission)
  Future<Map<String, dynamic>> detectProducts(File imageFile) async {
    try {
      final formData = FormData.fromMap({
        'photo': await MultipartFile.fromFile(
          imageFile.path,
          filename: imageFile.path.split('/').last,
        ),
      });
      
      final response = await _dio.post(
        '/api/restock/detect',
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
        ),
      );
      
      if (response.statusCode == 200 && response.data['success'] == true) {
        return {
          'success': true,
          'detections': response.data['detections'] ?? [],
          'product_counts': response.data['product_counts'] ?? {},
          'total_detections': response.data['total_detections'] ?? 0,
        };
      } else {
        return {
          'success': false,
          'message': response.data['message'] ?? 'Detection failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }
  
  // Submit Restock
  Future<Map<String, dynamic>> submitRestock({
    required List<File> photos,
    required String station,
    required String product,
    String? notes,
    Map<String, dynamic>? detectionResults,
    double? latitude,
    double? longitude,
  }) async {
    try {
      final formData = FormData();
      
      // Add photos
      for (int i = 0; i < photos.length; i++) {
        formData.files.add(
          MapEntry(
            'photo_$i',
            await MultipartFile.fromFile(
              photos[i].path,
              filename: 'photo_$i.jpg',
            ),
          ),
        );
      }
      
      // Add other fields
      formData.fields.addAll({
        'station': station,
        'product': product,
        if (notes != null && notes.isNotEmpty) 'notes': notes,
        if (latitude != null) 'latitude': latitude.toString(),
        if (longitude != null) 'longitude': longitude.toString(),
      });
      
      // Add detection results if available
      if (detectionResults != null) {
        formData.fields.add(
          MapEntry('detection_results', jsonEncode(detectionResults)),
        );
      }
      
      final response = await _dio.post(
        '/api/restock/upload',
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
        ),
      );
      
      if (response.statusCode == 200 && response.data['success'] == true) {
        return {
          'success': true,
          'submission_id': response.data['submission_id'],
          'message': response.data['message'] ?? 'Submission successful',
        };
      } else {
        return {
          'success': false,
          'message': response.data['message'] ?? 'Upload failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }
  
  // Get Employee Submissions
  Future<List<Map<String, dynamic>>> getSubmissions() async {
    try {
      final response = await _dio.get('/api/restock/submissions');
      
      if (response.statusCode == 200 && response.data['success'] == true) {
        return List<Map<String, dynamic>>.from(response.data['submissions'] ?? []);
      }
      return [];
    } catch (e) {
      return [];
    }
  }
  
  // Get Notifications
  Future<List<Map<String, dynamic>>> getNotifications() async {
    try {
      final response = await _dio.get('/api/restock/notifications');
      
      if (response.statusCode == 200 && response.data['success'] == true) {
        return List<Map<String, dynamic>>.from(response.data['notifications'] ?? []);
      }
      return [];
    } catch (e) {
      return [];
    }
  }
  
  // Get Notification Count
  Future<int> getNotificationCount() async {
    try {
      final response = await _dio.get('/api/restock/notifications/count');
      
      if (response.statusCode == 200) {
        return response.data['count'] ?? 0;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }
  
  // Mark Notification as Read
  Future<bool> markNotificationRead(String notificationId) async {
    try {
      final response = await _dio.post(
        '/api/restock/notifications/read',
        data: {'notification_id': notificationId},
      );
      
      return response.statusCode == 200 && response.data['success'] == true;
    } catch (e) {
      return false;
    }
  }
  
  // Get Photo URL
  String getPhotoUrl(String filename) {
    return '$_baseUrl/api/restock/photo/$filename';
  }
}

