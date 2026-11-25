import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/utils/responsive.dart';
import '../../../shared/widgets/section_title.dart';
import '../view_models/about_view_model.dart';
import '../widgets/info_tile.dart';

/// "About Me": summary, experience and education.
class AboutSection extends StatelessWidget {
  final AboutViewModel viewModel;

  const AboutSection({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    final isTablet = Responsive.isTablet(context);

    return Container(
      color: Colors.black,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 16,
        vertical: isMobile ? 50 : 100,
      ),
      child: Column(
        children: [
          const SectionTitle('About Me', mobileSize: 24, desktopSize: 30),
          SizedBox(height: isMobile ? 20 : 30),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: Text(
              viewModel.summary,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white70,
                fontSize: isMobile ? 14 : 16,
                height: 1.6,
              ),
            ),
          ),
          SizedBox(height: isMobile ? 40 : 60),
          if (isMobile || isTablet)
            Column(
              children: [
                _ExperienceColumn(viewModel: viewModel),
                const SizedBox(height: 30),
                Lottie.asset(
                  AppAssets.laptopAnimation,
                  height: isMobile ? 200 : 300,
                  fit: BoxFit.contain,
                ),
                const SizedBox(height: 30),
                _EducationColumn(viewModel: viewModel),
              ],
            )
          else
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1300),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                      flex: 3, child: _ExperienceColumn(viewModel: viewModel)),
                  const SizedBox(width: 40),
                  Expanded(
                    flex: 2,
                    child: Column(
                      children: [
                        _EducationColumn(viewModel: viewModel),
                        const SizedBox(height: 30),
                        Lottie.asset(
                          AppAssets.laptopAnimation,
                          height: 320,
                          fit: BoxFit.contain,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _ExperienceColumn extends StatelessWidget {
  final AboutViewModel viewModel;

  const _ExperienceColumn({required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Column(
      children: [
        const SectionTitle('Experience'),
        SizedBox(height: isMobile ? 15 : 20),
        for (final job in viewModel.jobs) ...[
          InfoTile(title: job.role, subtitle: job.subtitle, points: job.points),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}

class _EducationColumn extends StatelessWidget {
  final AboutViewModel viewModel;

  const _EducationColumn({required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Column(
      children: [
        const SectionTitle('Education'),
        SizedBox(height: isMobile ? 15 : 20),
        for (final item in viewModel.education) ...[
          InfoTile(title: item.title, subtitle: item.details),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}
