import 'package:flutter/material.dart';
import '../models/restock_photo.dart';

class PhotoPreviewCard extends StatelessWidget {
  final RestockPhoto photo;
  final VoidCallback onRemove;
  final VoidCallback onRetake;

  const PhotoPreviewCard({
    super.key,
    required this.photo,
    required this.onRemove,
    required this.onRetake,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF1A2332)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                  child: Image.file(
                    photo.file,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(8),
                color: const Color(0xFF0C1322),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      photo.angle,
                      style: const TextStyle(
                        color: Color(0xFFF1F5F9),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (photo.productCounts.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        'Detected: ${photo.totalDetections} items',
                        style: const TextStyle(
                          color: Color(0xFF10B981),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
        Positioned(
          top: 4,
          right: 4,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.refresh, size: 18),
                color: Colors.white,
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black54,
                  padding: const EdgeInsets.all(6),
                ),
                onPressed: onRetake,
                tooltip: 'Retake',
              ),
              const SizedBox(width: 4),
              IconButton(
                icon: const Icon(Icons.close, size: 18),
                color: Colors.white,
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black54,
                  padding: const EdgeInsets.all(6),
                ),
                onPressed: onRemove,
                tooltip: 'Remove',
              ),
            ],
          ),
        ),
      ],
    );
  }
}

