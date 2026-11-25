import 'package:flutter/material.dart';

/// Lifts its child slightly while the mouse is over it.
///
/// [builder] also receives the hover state, for children that change their
/// own look on hover (e.g. a stronger shadow).
class HoverLift extends StatefulWidget {
  final double lift;
  final Widget Function(BuildContext context, bool hovering) builder;

  const HoverLift({super.key, this.lift = 8, required this.builder});

  /// Convenience constructor for a child that does not react to hover itself.
  HoverLift.child({super.key, this.lift = 8, required Widget child})
      : builder = ((_, __) => child);

  @override
  State<HoverLift> createState() => _HoverLiftState();
}

class _HoverLiftState extends State<HoverLift> {
  bool _hovering = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovering = true),
      onExit: (_) => setState(() => _hovering = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform:
            Matrix4.translationValues(0, _hovering ? -widget.lift : 0, 0),
        child: widget.builder(context, _hovering),
      ),
    );
  }
}
