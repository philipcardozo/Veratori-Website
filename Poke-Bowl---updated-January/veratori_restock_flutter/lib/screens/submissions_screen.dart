import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/restock_provider.dart';
import '../services/api_service.dart';

class SubmissionsScreen extends StatefulWidget {
  const SubmissionsScreen({super.key});

  @override
  State<SubmissionsScreen> createState() => _SubmissionsScreenState();
}

class _SubmissionsScreenState extends State<SubmissionsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<RestockProvider>(context, listen: false).loadSubmissions();
    });
  }

  String _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'approved':
        return '#10B981';
      case 'flagged':
        return '#EF4444';
      case 'adjustment_required':
        return '#F59E0B';
      default:
        return '#64748B';
    }
  }

  String _formatStatus(String status) {
    return status.replaceAll('_', ' ').split(' ').map((word) {
      return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<RestockProvider>(
      builder: (context, provider, _) {
        if (provider.isLoading && provider.submissions.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }

        if (provider.submissions.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.inbox,
                  size: 64,
                  color: Colors.grey[600],
                ),
                const SizedBox(height: 16),
                Text(
                  'No submissions yet',
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Submit your first restock to see it here',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => provider.loadSubmissions(),
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: provider.submissions.length,
            itemBuilder: (context, index) {
              final submission = provider.submissions[index];
              final status = submission['status'] ?? 'pending';
              final statusColor = _getStatusColor(status);
              
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                color: const Color(0xFF111827),
                child: ExpansionTile(
                  title: Text(
                    '${submission['product'] ?? 'Unknown'} - ${submission['station'] ?? 'Unknown'}',
                    style: const TextStyle(
                      color: Color(0xFFF1F5F9),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  subtitle: Text(
                    DateFormat('MMM d, y • h:mm a').format(
                      DateTime.fromMillisecondsSinceEpoch(
                        (submission['timestamp'] ?? 0) * 1000,
                      ),
                    ),
                    style: const TextStyle(color: Color(0xFF94A3B8)),
                  ),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Color(int.parse(statusColor.substring(1), radix: 16) + 0xFF000000).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: Color(int.parse(statusColor.substring(1), radix: 16) + 0xFF000000),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      _formatStatus(status),
                      style: TextStyle(
                        color: Color(int.parse(statusColor.substring(1), radix: 16) + 0xFF000000),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (submission['detection_results'] != null) ...[
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: const Color(0xFF3B82F6).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'YOLO Detection Results:',
                                    style: TextStyle(
                                      color: Color(0xFF3B82F6),
                                      fontWeight: FontWeight.w600,
                                      fontSize: 12,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: (submission['detection_results']['product_counts'] as Map<String, dynamic>?)
                                            ?.entries
                                            .map((entry) => Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFF0B1120),
                                                    borderRadius: BorderRadius.circular(4),
                                                  ),
                                                  child: Text(
                                                    '${entry.key}: ${entry.value}',
                                                    style: const TextStyle(
                                                      color: Color(0xFFF1F5F9),
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                ))
                                            .toList() ??
                                        [],
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                          ],
                          if (submission['notes'] != null && submission['notes'].toString().isNotEmpty) ...[
                            Text(
                              'Notes:',
                              style: TextStyle(
                                color: Colors.grey[400],
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              submission['notes'],
                              style: const TextStyle(
                                color: Color(0xFF94A3B8),
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 12),
                          ],
                          if (submission['feedback'] != null && submission['feedback'].toString().isNotEmpty) ...[
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Manager Feedback:',
                                    style: TextStyle(
                                      color: Color(0xFF10B981),
                                      fontWeight: FontWeight.w600,
                                      fontSize: 12,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    submission['feedback'],
                                    style: const TextStyle(
                                      color: Color(0xFFF1F5F9),
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }
}

