import 'package:flutter/material.dart';

import '../../core/utils/responsive.dart';

/// Bold white heading used at the top of each section.
class SectionTitle extends StatelessWidget {
  final String text;
  final double mobileSize;
  final double desktopSize;

  const SectionTitle(
    this.text, {
    super.key,
    this.mobileSize = 22,
    this.desktopSize = 28,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: TextStyle(
        color: Colors.white,
        fontSize:
            Responsive.value(context, mobile: mobileSize, other: desktopSize),
        fontWeight: FontWeight.bold,
      ),
    );
  }
}
