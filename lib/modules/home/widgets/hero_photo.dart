import 'package:flutter/material.dart';

import '../../../core/constants/app_constants.dart';

/// Round profile photo with a softly pulsing indigo border.
class HeroPhoto extends StatefulWidget {
  final double size;

  const HeroPhoto({super.key, required this.size});

  @override
  State<HeroPhoto> createState() => _HeroPhotoState();
}

class _HeroPhotoState extends State<HeroPhoto>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    duration: const Duration(seconds: 10),
    vsync: this,
  )..repeat();

  late final Animation<double> _borderWidth = Tween<double>(begin: 2, end: 6)
      .animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = widget.size;
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: size, maxHeight: size),
        child: AnimatedBuilder(
          animation: _borderWidth,
          builder: (context, child) => OverflowBox(
            minWidth: 0,
            minHeight: 0,
            maxWidth: double.infinity,
            maxHeight: double.infinity,
            child: Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.indigo.shade900,
                  width: _borderWidth.value,
                ),
              ),
              child: child,
            ),
          ),
          child: ClipOval(
            child: Image.asset(AppAssets.profilePhoto, fit: BoxFit.cover),
          ),
        ),
      ),
    );
  }
}
