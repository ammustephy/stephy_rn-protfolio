import 'package:flutter/material.dart';

import '../../../core/utils/responsive.dart';
import '../../../shared/widgets/hover_lift.dart';

/// A platform (Android, iOS, Web, Desktop) with its icon.
class PlatformChip extends StatelessWidget {
  final String label;

  const PlatformChip({super.key, required this.label});

  static const Map<String, IconData> _icons = {
    'Android': Icons.android,
    'iOS': Icons.apple,
    'Web': Icons.language,
    'Desktop': Icons.desktop_windows,
  };

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return HoverLift.child(
      child: TextButton.icon(
        onPressed: () {},
        icon: Icon(
          _icons[label] ?? Icons.devices,
          color: Colors.white,
          size: isMobile ? 18 : 24,
        ),
        label: Text(
          label,
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 12 : 14),
        ),
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.all(Colors.indigo.shade900),
          padding: WidgetStateProperty.all(
            EdgeInsets.symmetric(
              horizontal: isMobile ? 12 : 16,
              vertical: isMobile ? 8 : 12,
            ),
          ),
        ),
      ),
    );
  }
}
