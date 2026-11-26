import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';

import '../../../core/platform/webgl_globe.dart';
import '../../../core/utils/responsive.dart';
import '../view_models/home_view_model.dart';
import 'hero_photo.dart';

/// Top of the page: greeting, pitch, action buttons, and the photo framed by
/// the WebGL globe.
class HeroSection extends StatelessWidget {
  final HomeViewModel viewModel;

  const HeroSection({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final w = Responsive.width(context);
    final isMobile = Responsive.isMobile(context);
    final isTablet = Responsive.isTablet(context);
    // Keep in sync with the globe placement in web/webgl/globe.js.
    final photoSize = isMobile ? w * 0.6 : (isTablet ? w * 0.4 : w * 0.35);

    return Stack(
      children: [
        // WebGL wireframe globe behind the photo (web only).
        const Positioned.fill(child: WebGLGlobe()),
        Padding(
          padding: EdgeInsets.symmetric(
            vertical: isMobile ? 40 : 80,
            horizontal: w * 0.07,
          ),
          child: isMobile || isTablet
              ? Column(
                  children: [
                    HeroPhoto(size: photoSize),
                    const SizedBox(height: 30),
                    _HeroText(viewModel: viewModel),
                  ],
                )
              : Row(
                  children: [
                    Expanded(flex: 2, child: _HeroText(viewModel: viewModel)),
                    const SizedBox(width: 20),
                    Expanded(child: HeroPhoto(size: photoSize)),
                  ],
                ),
        ),
      ],
    );
  }
}

class _HeroText extends StatelessWidget {
  final HomeViewModel viewModel;

  const _HeroText({required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        DefaultTextStyle(
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 22 : 30),
          child: AnimatedTextKit(
            animatedTexts: [
              TypewriterAnimatedText(
                viewModel.heroGreeting,
                speed: const Duration(milliseconds: 100),
              ),
            ],
            totalRepeatCount: 1,
          ),
        ),
        const SizedBox(height: 16),
        ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 560),
          child: Text(
            viewModel.heroPitch,
            style: TextStyle(
              color: Colors.white70,
              fontSize: isMobile ? 14 : 16,
              height: 1.5,
            ),
          ),
        ),
        const SizedBox(height: 24),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _HeroButton(
              label: 'View Projects',
              filled: true,
              onPressed: () => viewModel.scrollTo(PortfolioSection.works),
            ),
            _HeroButton(
              label: 'Download Resume',
              onPressed: viewModel.downloadResume,
            ),
            _HeroButton(
              label: 'Get in Touch',
              onPressed: () => viewModel.scrollTo(PortfolioSection.contact),
            ),
          ],
        ),
      ],
    );
  }
}

class _HeroButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final bool filled;

  const _HeroButton({
    required this.label,
    required this.onPressed,
    this.filled = false,
  });

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    final padding = EdgeInsets.symmetric(
      horizontal: isMobile ? 16 : 20,
      vertical: isMobile ? 12 : 16,
    );
    final text = Text(
      label,
      style: TextStyle(color: Colors.white, fontSize: isMobile ? 14 : 16),
    );

    return filled
        ? ElevatedButton(
            onPressed: onPressed,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo.shade900,
              padding: padding,
            ),
            child: text,
          )
        : OutlinedButton(
            onPressed: onPressed,
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: Colors.indigo.shade300),
              padding: padding,
            ),
            child: text,
          );
  }
}
