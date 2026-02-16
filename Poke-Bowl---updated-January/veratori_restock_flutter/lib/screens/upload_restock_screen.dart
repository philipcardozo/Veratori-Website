import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:permission_handler/permission_handler.dart';
import '../providers/restock_provider.dart';
import '../providers/auth_provider.dart';
import '../models/restock_photo.dart';
import '../widgets/photo_preview_card.dart';

class UploadRestockScreen extends StatefulWidget {
  const UploadRestockScreen({super.key});

  @override
  State<UploadRestockScreen> createState() => _UploadRestockScreenState();
}

class _UploadRestockScreenState extends State<UploadRestockScreen> {
  final _formKey = GlobalKey<FormState>();
  final _stationController = TextEditingController();
  final _productController = TextEditingController();
  final _notesController = TextEditingController();
  
  final ImagePicker _picker = ImagePicker();
  List<RestockPhoto> _photos = [];
  bool _isSubmitting = false;
  bool _isDetecting = false;
  
  // Station options
  final List<String> _stations = [
    'Station 1',
    'Station 2',
    'Station 3',
    'Station 4',
    'Station 5',
  ];
  
  // Product options (should match backend product classes)
  final List<String> _products = [
    'mango',
    'watermelon',
    'pineapple',
    'passion fruit',
    'maui custard',
    'lemon cake',
  ];

  @override
  void dispose() {
    _stationController.dispose();
    _productController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _requestPermissions() async {
    await [
      Permission.camera,
      Permission.photos,
    ].request();
  }

  Future<void> _capturePhoto() async {
    await _requestPermissions();
    
    if (_photos.length >= 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Maximum 10 photos allowed')),
      );
      return;
    }

    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
        maxWidth: 1920,
        maxHeight: 1920,
      );

      if (image != null) {
        setState(() {
          _isDetecting = true;
        });

        // Run YOLO detection
        final restockProvider = Provider.of<RestockProvider>(context, listen: false);
        final apiService = restockProvider.apiService;
        
        final detectionResult = await apiService.detectProducts(File(image.path));
        
        setState(() {
          _photos.add(RestockPhoto(
            file: File(image.path),
            angle: _getPhotoAngle(_photos.length),
            detections: detectionResult['detections'] ?? [],
            productCounts: Map<String, int>.from(detectionResult['product_counts'] ?? {}),
            totalDetections: detectionResult['total_detections'] ?? 0,
          ));
          _isDetecting = false;
        });
      }
    } catch (e) {
      setState(() {
        _isDetecting = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error capturing photo: $e')),
        );
      }
    }
  }

  Future<void> _pickPhotoFromGallery() async {
    await _requestPermissions();
    
    if (_photos.length >= 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Maximum 10 photos allowed')),
      );
      return;
    }

    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
        maxWidth: 1920,
        maxHeight: 1920,
      );

      if (image != null) {
        setState(() {
          _isDetecting = true;
        });

        // Run YOLO detection
        final restockProvider = Provider.of<RestockProvider>(context, listen: false);
        final apiService = restockProvider.apiService;
        
        final detectionResult = await apiService.detectProducts(File(image.path));
        
        setState(() {
          _photos.add(RestockPhoto(
            file: File(image.path),
            angle: _getPhotoAngle(_photos.length),
            detections: detectionResult['detections'] ?? [],
            productCounts: Map<String, int>.from(detectionResult['product_counts'] ?? {}),
            totalDetections: detectionResult['total_detections'] ?? 0,
          ));
          _isDetecting = false;
        });
      }
    } catch (e) {
      setState(() {
        _isDetecting = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking photo: $e')),
        );
      }
    }
  }

  String _getPhotoAngle(int index) {
    if (index == 0) return 'Front';
    if (index == 1) return 'Left';
    if (index == 2) return 'Right';
    return 'Additional ${index - 2}';
  }

  void _removePhoto(int index) {
    setState(() {
      _photos.removeAt(index);
    });
  }

  void _retakePhoto(int index) async {
    _removePhoto(index);
    await _capturePhoto();
  }

  Future<void> _submitRestock() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_photos.length < 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please capture at least 3 photos')),
      );
      return;
    }

    // Check for duplicate submission (within 5-10 minutes)
    // This would be handled by backend, but we can show a warning
    
    setState(() {
      _isSubmitting = true;
    });

    try {
      final restockProvider = Provider.of<RestockProvider>(context, listen: false);
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      // Aggregate detection results from all photos
      final allDetections = <Map<String, dynamic>>[];
      final aggregatedCounts = <String, int>{};
      
      for (var photo in _photos) {
        allDetections.addAll(photo.detections);
        photo.productCounts.forEach((key, value) {
          aggregatedCounts[key] = (aggregatedCounts[key] ?? 0) + value;
        });
      }
      
      final detectionResults = {
        'product_counts': aggregatedCounts,
        'total_detections': allDetections.length,
        'photo_count': _photos.length,
      };

      final result = await restockProvider.submitRestock(
        photoPaths: _photos.map((p) => p.file.path).toList(),
        station: _stationController.text,
        product: _productController.text,
        notes: _notesController.text.isEmpty ? null : _notesController.text,
        detectionResults: detectionResults,
      );

      if (mounted) {
        if (result['success'] == true) {
          // Clear form
          _stationController.clear();
          _productController.clear();
          _notesController.clear();
          setState(() {
            _photos.clear();
          });

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Restock submitted successfully!'),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result['message'] ?? 'Submission failed'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Station Dropdown
              DropdownButtonFormField<String>(
                value: _stationController.text.isEmpty ? null : _stationController.text,
                decoration: InputDecoration(
                  labelText: 'Station *',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                  filled: true,
                  fillColor: const Color(0xFF0C1322),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF1A2332)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF1A2332)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF10B981), width: 2),
                  ),
                ),
                items: _stations.map((station) {
                  return DropdownMenuItem(
                    value: station,
                    child: Text(station, style: const TextStyle(color: Color(0xFFF1F5F9))),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _stationController.text = value ?? '';
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a station';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              
              // Product Dropdown
              DropdownButtonFormField<String>(
                value: _productController.text.isEmpty ? null : _productController.text,
                decoration: InputDecoration(
                  labelText: 'Product *',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                  filled: true,
                  fillColor: const Color(0xFF0C1322),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF1A2332)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF1A2332)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF10B981), width: 2),
                  ),
                ),
                items: _products.map((product) {
                  return DropdownMenuItem(
                    value: product,
                    child: Text(
                      product.replaceAll('_', ' ').toUpperCase(),
                      style: const TextStyle(color: Color(0xFFF1F5F9)),
                    ),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _productController.text = value ?? '';
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a product';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              
              // Notes
              TextFormField(
                controller: _notesController,
                decoration: InputDecoration(
                  labelText: 'Notes (optional)',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                  filled: true,
                  fillColor: const Color(0xFF0C1322),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF1A2332)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF1A2332)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF10B981), width: 2),
                  ),
                ),
                style: const TextStyle(color: Color(0xFFF1F5F9)),
                maxLines: 3,
              ),
              const SizedBox(height: 24),
              
              // Photo Section
              const Text(
                'Photos (Minimum 3 required)',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFF1F5F9),
                ),
              ),
              const SizedBox(height: 12),
              
              // Photo Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _isDetecting ? null : _capturePhoto,
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Take Photo'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _isDetecting ? null : _pickPhotoFromGallery,
                      icon: const Icon(Icons.photo_library),
                      label: const Text('From Gallery'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF10B981),
                        side: const BorderSide(color: Color(0xFF10B981)),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // Photo Grid
              if (_photos.isEmpty && !_isDetecting)
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0C1322),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFF1A2332)),
                  ),
                  child: const Center(
                    child: Text(
                      'No photos captured yet\nTap "Take Photo" to start',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF64748B)),
                    ),
                  ),
                )
              else if (_isDetecting)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32.0),
                    child: CircularProgressIndicator(),
                  ),
                )
              else
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.75,
                  ),
                  itemCount: _photos.length,
                  itemBuilder: (context, index) {
                    return PhotoPreviewCard(
                      photo: _photos[index],
                      onRemove: () => _removePhoto(index),
                      onRetake: () => _retakePhoto(index),
                    );
                  },
                ),
              
              const SizedBox(height: 24),
              
              // Submit Button
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitRestock,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  elevation: 0,
                ),
                child: _isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text(
                        'Submit Restock',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

