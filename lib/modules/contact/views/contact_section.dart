import 'package:flutter/material.dart';

import '../view_models/contact_view_model.dart';
import '../widgets/contact_details.dart';
import '../widgets/contact_form.dart';

/// "Get in Touch": contact details beside (or above) the message form.
class ContactSection extends StatelessWidget {
  final ContactViewModel viewModel;

  const ContactSection({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final w = constraints.maxWidth;
        final isMobile = w < 600;
        final isWide = w > 800;

        return Container(
          color: Colors.black,
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 12 : 16,
            vertical: isMobile ? 60 : 140,
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1000),
              child: isWide
                  ? Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: ContactDetails(viewModel: viewModel)),
                        const SizedBox(width: 40),
                        Expanded(
                          child:
                              ContactForm(viewModel: viewModel, isWide: true),
                        ),
                      ],
                    )
                  : Column(
                      children: [
                        ContactDetails(viewModel: viewModel),
                        const SizedBox(height: 40),
                        ContactForm(viewModel: viewModel, isWide: false),
                      ],
                    ),
            ),
          ),
        );
      },
    );
  }
}
