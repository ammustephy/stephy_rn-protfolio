import 'package:flutter/material.dart';

/// App bar link that grows on hover, shrinks on press and shows an underline.
class NavLink extends StatefulWidget {
  final String label;
  final VoidCallback onTap;

  const NavLink({super.key, required this.label, required this.onTap});

  @override
  State<NavLink> createState() => _NavLinkState();
}

class _NavLinkState extends State<NavLink> {
  bool _hovering = false;
  bool _pressing = false;

  @override
  Widget build(BuildContext context) {
    final scale = _pressing ? 0.95 : (_hovering ? 1.1 : 1.0);

    return MouseRegion(
      onEnter: (_) => setState(() => _hovering = true),
      onExit: (_) => setState(() => _hovering = false),
      child: GestureDetector(
        onTap: widget.onTap,
        onTapDown: (_) => setState(() => _pressing = true),
        onTapUp: (_) => setState(() => _pressing = false),
        onTapCancel: () => setState(() => _pressing = false),
        child: AnimatedScale(
          scale: scale,
          duration: const Duration(milliseconds: 100),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            padding: EdgeInsets.only(bottom: _hovering ? 6 : 2),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color:
                      _hovering ? Colors.indigo.shade900 : Colors.transparent,
                  width: 2,
                ),
              ),
            ),
            child:
                Text(widget.label, style: const TextStyle(color: Colors.white)),
          ),
        ),
      ),
    );
  }
}
