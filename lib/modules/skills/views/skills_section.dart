import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/utils/responsive.dart';
import '../view_models/skills_view_model.dart';
import '../widgets/platform_chip.dart';
import '../widgets/resume_button.dart';
import '../widgets/skill_chip.dart';

/// "What I can do": platforms, skills and the resume buttons, next to the
/// laptop animation.
class SkillsSection extends StatelessWidget {
  final SkillsViewModel viewModel;

  const SkillsSection({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    final isTablet = Responsive.isTablet(context);

    return Container(
      color: Colors.black,
      constraints: BoxConstraints(minHeight: isMobile ? 300 : 600),
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 20,
        vertical: isMobile ? 30 : 60,
      ),
      child: isMobile
          ? Column(
              children: [
                _SkillsContent(viewModel: viewModel),
                const SizedBox(height: 20),
                Lottie.asset(
                  AppAssets.openLaptopAnimation,
                  height: 250,
                  fit: BoxFit.contain,
                ),
              ],
            )
          : Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Lottie.asset(
                    AppAssets.openLaptopAnimation,
                    height: isTablet ? 500 : 700,
                    fit: BoxFit.contain,
                  ),
                ),
                SizedBox(width: isTablet ? 20 : 40),
                Expanded(child: _SkillsContent(viewModel: viewModel)),
              ],
            ),
    );
  }
}

class _SkillsContent extends StatelessWidget {
  final SkillsViewModel viewModel;

  const _SkillsContent({required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: isMobile ? 20 : 30),
        Text(
          'What I can do',
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 24 : 32),
        ),
        SizedBox(height: isMobile ? 15 : 20),
        Text(
          'Platforms I Build For',
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 18 : 25),
        ),
        SizedBox(height: isMobile ? 15 : 20),
        Wrap(
          spacing: isMobile ? 8 : 16,
          runSpacing: isMobile ? 8 : 16,
          children: [
            for (final platform in viewModel.platforms)
              PlatformChip(label: platform),
          ],
        ),
        SizedBox(height: isMobile ? 25 : 40),
        Text(
          'My Skills',
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 18 : 22),
        ),
        SizedBox(height: isMobile ? 20 : 30),
        Wrap(
          spacing: isMobile ? 8 : 15,
          runSpacing: isMobile ? 8 : 15,
          children: [
            for (final skill in viewModel.skills) SkillChip(label: skill),
          ],
        ),
        SizedBox(height: isMobile ? 40 : 100),
        Center(
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              ResumeButton(
                label: 'Download Resume',
                onPressed: viewModel.downloadResume,
              ),
              ResumeButton(
                label: 'View Resume',
                onPressed: viewModel.viewResume,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
