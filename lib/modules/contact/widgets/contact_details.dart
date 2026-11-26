import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:lottie/lottie.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/utils/responsive.dart';
import '../view_models/contact_view_model.dart';

/// Location, email, phone and social links.
class ContactDetails extends StatelessWidget {
  final ContactViewModel viewModel;

  const ContactDetails({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    final labelStyle =
        TextStyle(color: Colors.white70, fontSize: isMobile ? 13 : 15);
    final valueStyle =
        TextStyle(color: Colors.white, fontSize: isMobile ? 14 : 16);
    final iconSize = isMobile ? 50.0 : 70.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Get in Touch',
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 24 : 32,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: isMobile ? 16 : 24),
        Text('📍 Location', style: labelStyle),
        Text(viewModel.location, style: valueStyle),
        SizedBox(height: isMobile ? 12 : 16),
        Text('✉️ Email', style: labelStyle),
        Text(viewModel.email, style: valueStyle),
        SizedBox(height: isMobile ? 12 : 16),
        Text('📞 Phone', style: labelStyle),
        Text(viewModel.phone, style: valueStyle),
        SizedBox(height: isMobile ? 16 : 24),
        Text(viewModel.note, style: labelStyle),
        const SizedBox(height: 15),
        Row(
          children: [
            _SocialButton(
              tooltip: 'Instagram',
              onTap: viewModel.openInstagram,
              child: Lottie.asset(AppAssets.instagramAnimation,
                  width: iconSize, height: iconSize),
            ),
            const SizedBox(width: 10),
            _SocialButton(
              tooltip: 'GitHub',
              onTap: viewModel.openGitHub,
              child: SizedBox(
                width: iconSize,
                height: iconSize,
                child: Center(
                  child: FaIcon(FontAwesomeIcons.github,
                      color: Colors.white, size: isMobile ? 30 : 40),
                ),
              ),
            ),
            const SizedBox(width: 10),
            _SocialButton(
              tooltip: 'LinkedIn',
              onTap: viewModel.openLinkedIn,
              child: Lottie.asset(AppAssets.linkedInAnimation,
                  width: iconSize, height: iconSize),
            ),
          ],
        ),
      ],
    );
  }
}

class _SocialButton extends StatelessWidget {
  final String tooltip;
  final VoidCallback onTap;
  final Widget child;

  const _SocialButton({
    required this.tooltip,
    required this.onTap,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(onTap: onTap, child: child),
      ),
    );
  }
}
