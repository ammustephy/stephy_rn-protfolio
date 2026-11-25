import 'dart:async';

import 'package:flutter/material.dart';
import 'package:jumping_dot/jumping_dot.dart';

import '../../../core/utils/responsive.dart';
import '../../home/views/home_view.dart';

/// Short loading screen shown before the home page.
class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(const Duration(seconds: 1), () {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeView()),
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Waiting ',
              style: TextStyle(
                color: Colors.white,
                fontSize: isMobile ? 18 : 25,
                fontWeight: FontWeight.bold,
              ),
            ),
            JumpingDots(
              numberOfDots: 3,
              color: Colors.white,
              radius: isMobile ? 6 : 8,
              animationDuration: const Duration(milliseconds: 300),
              innerPadding: 4.0,
              verticalOffset: isMobile ? 6 : 8,
            ),
          ],
        ),
      ),
    );
  }
}
