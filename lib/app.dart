import 'package:flutter/material.dart';

import 'core/constants/app_constants.dart';
import 'modules/splash/views/splash_view.dart';

class PortfolioApp extends StatelessWidget {
  const PortfolioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: AppConstants.appTitle,
      debugShowCheckedModeBanner: false,
      home: SplashView(),
    );
  }
}
