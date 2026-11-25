import 'package:flutter/widgets.dart';

/// A project shown in the Works & Projects grid and its detail page.
class Project {
  final String title;

  /// Short text on the card.
  final String description;

  /// Long text, with key features, on the detail page.
  final String fullDescription;
  final String conclusion;

  /// Card image. When null the card shows [icon] on a gradient instead.
  final String? image;
  final IconData? icon;
  final List<String> screenshots;

  const Project({
    required this.title,
    required this.description,
    required this.fullDescription,
    required this.conclusion,
    this.image,
    this.icon,
    this.screenshots = const [],
  });
}
