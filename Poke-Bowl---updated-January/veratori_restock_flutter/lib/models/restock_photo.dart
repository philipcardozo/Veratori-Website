import 'dart:io';

class RestockPhoto {
  final File file;
  final String angle;
  final List<Map<String, dynamic>> detections;
  final Map<String, int> productCounts;
  final int totalDetections;

  RestockPhoto({
    required this.file,
    required this.angle,
    required this.detections,
    required this.productCounts,
    required this.totalDetections,
  });
}

