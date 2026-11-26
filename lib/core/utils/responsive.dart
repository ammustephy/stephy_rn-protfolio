import 'package:flutter/widgets.dart';

/// Screen-size breakpoints shared by every module.
///
/// Mobile is below 600px, tablet 600-899px and desktop 900px and up. The
/// WebGL globe (web/webgl/globe.js) uses the same breakpoints.
class Responsive {
  Responsive._();

  static const double mobileMax = 600;
  static const double tabletMax = 900;

  static double width(BuildContext context) => MediaQuery.sizeOf(context).width;

  static bool isMobile(BuildContext context) => width(context) < mobileMax;

  static bool isTablet(BuildContext context) {
    final w = width(context);
    return w >= mobileMax && w < tabletMax;
  }

  static bool isDesktop(BuildContext context) => width(context) >= tabletMax;

  /// Returns [mobile] on phones and [other] on larger screens.
  static T value<T>(BuildContext context,
          {required T mobile, required T other}) =>
      isMobile(context) ? mobile : other;
}
