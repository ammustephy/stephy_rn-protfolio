import 'package:flutter/material.dart';

import '../../../core/utils/responsive.dart';
import '../../../shared/widgets/hover_lift.dart';

/// A skill name as a raised chip that lifts on hover.
class SkillChip extends StatelessWidget {
  final String label;

  const SkillChip({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return HoverLift(
      lift: 6,
      builder: (context, hovering) => ElevatedButton(
        style: ElevatedButton.styleFrom(
          elevation: hovering ? 8 : 4,
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 12 : 16,
            vertical: isMobile ? 8 : 12,
          ),
        ),
        onPressed: () {},
        child: Text(label, style: TextStyle(fontSize: isMobile ? 12 : 14)),
      ),
    );
  }
}
