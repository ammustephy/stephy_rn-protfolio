import 'package:flutter/material.dart';

import '../../../core/utils/responsive.dart';

/// Gradient card with a title, a subtitle and optional bullet points.
/// Used for both jobs and education.
class InfoTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final List<String> points;

  const InfoTile({
    super.key,
    required this.title,
    required this.subtitle,
    this.points = const [],
  });

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    final pointStyle = TextStyle(
      color: Colors.white70,
      fontSize: isMobile ? 13 : 14,
      height: 1.4,
    );

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.indigo.shade900, Colors.black],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      padding: EdgeInsets.all(isMobile ? 16 : 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: Colors.white,
              fontSize: isMobile ? 15 : 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(color: Colors.white, fontSize: isMobile ? 13 : 15),
          ),
          if (points.isNotEmpty) const SizedBox(height: 10),
          for (final point in points)
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('•  ', style: pointStyle),
                  Expanded(child: Text(point, style: pointStyle)),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
