import 'dart:async';

import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';
import 'package:jumping_dot/jumping_dot.dart';
import 'web_functionality.dart'
    if (dart.library.html) 'web_functionality_web.dart';

import 'package:lottie/lottie.dart';
import 'package:url_launcher/url_launcher.dart';

////////MAIN FUNCTION///////////////////////////////////////////////

void main() {
  configureApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Portfolio',
      debugShowCheckedModeBanner: false,
      home: MyPortfolioSplash(),
    );
  }
}

////////////////SPLASH///////////////////////////////////////////////////////////////

class MyPortfolioSplash extends StatefulWidget {
  @override
  State<MyPortfolioSplash> createState() => _MyPortfolioSplashState();
}

class _MyPortfolioSplashState extends State<MyPortfolioSplash> {
  @override
  void initState() {
    super.initState();
    Timer(Duration(seconds: 1), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => MyPortfolioHome()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

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
              animationDuration: Duration(milliseconds: 300),
              innerPadding: 4.0,
              verticalOffset: isMobile ? 6 : 8,
            ),
          ],
        ),
      ),
    );
  }
}

class HoverJumpCard extends StatefulWidget {
  final Widget child;

  const HoverJumpCard({required this.child, Key? key}) : super(key: key);

  @override
  _HoverJumpCardState createState() => _HoverJumpCardState();
}

class _HoverJumpCardState extends State<HoverJumpCard> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.translationValues(0, _hover ? -8 : 0, 0),
        child: widget.child,
      ),
    );
  }
}

class _JumpingSkillButton extends StatefulWidget {
  final String label;

  const _JumpingSkillButton({required this.label});

  @override
  __JumpingSkillButtonState createState() => __JumpingSkillButtonState();
}

class __JumpingSkillButtonState extends State<_JumpingSkillButton> {
  bool _isHovering = false;

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovering = true),
      onExit: (_) => setState(() => _isHovering = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.translationValues(0, _isHovering ? -6 : 0, 0),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            elevation: _isHovering ? 8 : 4,
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 12 : 16,
              vertical: isMobile ? 8 : 12,
            ),
          ),
          onPressed: () {},
          child: Text(
            widget.label,
            style: TextStyle(fontSize: isMobile ? 12 : 14),
          ),
        ),
      ),
    );
  }
}

// Redundant functions removed as they are now handled by web_functionality.dart

Widget _platformsContent(BuildContext context) {
  final screenWidth = MediaQuery.of(context).size.width;
  final isMobile = screenWidth < 600;

  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      SizedBox(height: isMobile ? 20 : 30),
      Text(
        'What I can do',
        style: TextStyle(
          color: Colors.white,
          fontSize: isMobile ? 24 : 32,
        ),
      ),
      SizedBox(height: isMobile ? 15 : 20),
      Text(
        'Platforms I Build For',
        style: TextStyle(
          color: Colors.white,
          fontSize: isMobile ? 18 : 25,
        ),
      ),
      SizedBox(height: isMobile ? 15 : 20),
      Wrap(
        spacing: isMobile ? 8 : 16,
        runSpacing: isMobile ? 8 : 16,
        children: [
          _platformButton(
              icon: Icons.android, label: 'Android', onPressed: () {}),
          _platformButton(icon: Icons.apple, label: 'iOS', onPressed: () {}),
          _platformButton(icon: Icons.language, label: 'Web', onPressed: () {}),
          _platformButton(
              icon: Icons.desktop_windows, label: 'Desktop', onPressed: () {}),
        ],
      ),
      SizedBox(height: isMobile ? 25 : 40),
      Text(
        'My Skills',
        style: TextStyle(
          color: Colors.white,
          fontSize: isMobile ? 18 : 22,
        ),
      ),
      SizedBox(height: isMobile ? 20 : 30),
      Wrap(
        spacing: isMobile ? 8 : 15,
        runSpacing: isMobile ? 8 : 15,
        children: [
          'Flutter',
          'Dart',
          'REST API Integration',
          'Node.js',
          'Express.js',
          'Firebase',
          'MongoDB',
          'MySQL',
          'Websocket',
          'Play Store Deployment',
          'Maps Integration',
          'Provider',
          'BLoC',
          'GetX',
          'Manual Testing',
          'Coding Conversion (CC)',
          'American Association Quality Control (AAQC)',
        ].map((skill) {
          return _JumpingSkillButton(label: skill);
        }).toList(),
      ),
      SizedBox(height: isMobile ? 40 : 100),
      Center(
        child: isMobile
            ? Column(
                children: [
                  _buildResumeButton(
                    label: 'Download Resume',
                    onPressed: () => downloadResume(
                      'Assets/Resume/STEPHY R.N-Flutter.pdf',
                      'STEPHY R.N-Flutter.pdf',
                    ),
                  ),
                  SizedBox(height: 12),
                  _buildResumeButton(
                    label: 'View Resume',
                    onPressed: () =>
                        viewResume('Assets/Resume/STEPHY R.N-FLR.pdf'),
                  ),
                ],
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildResumeButton(
                    label: 'Download Resume',
                    onPressed: () => downloadResume(
                      'Assets/Resume/STEPHY R.N-FLR.pdf',
                      'STEPHY R.N-FLR.pdf',
                    ),
                  ),
                  SizedBox(width: 12),
                  _buildResumeButton(
                    label: 'View Resume',
                    onPressed: () =>
                        viewResume('Assets/Resume/STEPHY R.N-FLR.pdf'),
                  ),
                ],
              ),
      ),
    ],
  );
}

Widget _buildResumeButton(
    {required String label, required VoidCallback onPressed}) {
  return Container(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.indigo.shade900, Colors.grey.shade700],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ),
      borderRadius: BorderRadius.circular(8),
    ),
    child: ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(color: Colors.white),
      ),
    ),
  );
}

Widget _experienceColumn(BuildContext context) {
  final isMobile = MediaQuery.of(context).size.width < 600;

  return Center(
    child: Column(
      children: [
        Text(
          'Experience',
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 22 : 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: isMobile ? 15 : 20),
        _experienceTile(
          'Flutter Developer',
          'Sigosoft Solutions Pvt Ltd • Jan 2026 – Present',
          context,
        ),
        SizedBox(height: 12),
        _experienceTile(
          'Associate Flutter Developer',
          'Kefi Tech Solutions Pvt Ltd • Jun 2025 – Dec 2025',
          context,
        ),
        SizedBox(height: 12),
        _experienceTile(
          'Electronic Quality Controller',
          'Aptara Learnings Pvt Ltd • Mar 2021 – Jun 2025',
          context,
        ),
      ],
    ),
  );
}

Widget _experienceTile(String role, String org, BuildContext context) {
  final isMobile = MediaQuery.of(context).size.width < 600;

  return Container(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.indigo.shade900, Colors.black],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ),
      borderRadius: BorderRadius.circular(8),
    ),
    padding: EdgeInsets.all(isMobile ? 16 : 24),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          role,
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 15 : 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 4),
        Text(
          org,
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 13 : 15,
          ),
        ),
      ],
    ),
  );
}

Widget _educationColumn(BuildContext context) {
  final isMobile = MediaQuery.of(context).size.width < 600;

  return Center(
    child: Column(
      children: [
        Text(
          'Education',
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 22 : 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: isMobile ? 15 : 20),
        _experienceTile(
          'B.Tech. Computer Science & Engineering',
          'Kerala University, CGPA: 7.0, 2021',
          context,
        ),
        SizedBox(height: 12),
        _experienceTile(
          'Flutter / Mobile Application Development',
          'Luminar Technolab, 2024',
          context,
        ),
      ],
    ),
  );
}

class _ContactForm extends StatefulWidget {
  final bool isWide;
  const _ContactForm({required this.isWide});

  @override
  __ContactFormState createState() => __ContactFormState();
}

class __ContactFormState extends State<_ContactForm> {
  final _formKey = GlobalKey<FormState>();
  String _name = '', _email = '', _message = '';

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Form(
      key: _formKey,
      child: Column(
        children: [
          SizedBox(height: isMobile ? 16 : 24),
          if (widget.isWide)
            Row(
              children: [
                Expanded(child: _buildNameField()),
                SizedBox(width: 20),
                Expanded(child: _buildEmailField()),
              ],
            )
          else ...[
            _buildNameField(),
            SizedBox(height: 20),
            _buildEmailField(),
          ],
          SizedBox(height: 20),
          _buildMessageField(),
          SizedBox(height: isMobile ? 16 : 24),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo.shade900,
              padding: EdgeInsets.symmetric(
                vertical: isMobile ? 12 : 16,
                horizontal: isMobile ? 20 : 24,
              ),
            ),
            onPressed: _submit,
            child: Text(
              'Send Message',
              style: TextStyle(
                fontSize: isMobile ? 16 : 18,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNameField() => TextFormField(
        style: TextStyle(color: Colors.white),
        decoration: _inputDecoration('Name'),
        validator: (v) =>
            v == null || v.trim().isEmpty ? 'Enter your name' : null,
        onSaved: (v) => _name = v!.trim(),
        textInputAction: TextInputAction.next,
      );

  Widget _buildEmailField() => TextFormField(
        style: TextStyle(color: Colors.white),
        decoration: _inputDecoration('Email'),
        validator: (v) {
          if (v == null || v.trim().isEmpty) return 'Enter your email';
          if (!RegExp(r'^[\w-.]+@([\w-]+\.)+\w{2,4}$').hasMatch(v.trim()))
            return 'Enter a valid email';
          return null;
        },
        onSaved: (v) => _email = v!.trim(),
        keyboardType: TextInputType.emailAddress,
        textInputAction: TextInputAction.next,
      );

  Widget _buildMessageField() => TextFormField(
        style: TextStyle(color: Colors.white),
        decoration: _inputDecoration('Message'),
        validator: (v) =>
            v == null || v.trim().isEmpty ? 'Enter a message' : null,
        onSaved: (v) => _message = v!.trim(),
        maxLines: 5,
        keyboardType: TextInputType.multiline,
      );

  InputDecoration _inputDecoration(String label) => InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.white70),
        filled: true,
        fillColor: Colors.grey[900],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        contentPadding: EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      );

  void _submit() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Thanks $_name! Your message is sent.'),
          backgroundColor: Colors.green,
        ),
      );
      _formKey.currentState!.reset();
    }
  }
}

class _platformButton extends StatefulWidget {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  const _platformButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    Key? key,
  }) : super(key: key);

  @override
  __platformButtonState createState() => __platformButtonState();
}

class __platformButtonState extends State<_platformButton> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.translationValues(0, _hover ? -8 : 0, 0),
        child: TextButton.icon(
          onPressed: widget.onPressed,
          icon:
              Icon(widget.icon, color: Colors.white, size: isMobile ? 18 : 24),
          label: Text(
            widget.label,
            style: TextStyle(
              color: Colors.white,
              fontSize: isMobile ? 12 : 14,
            ),
          ),
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(Colors.indigo.shade900),
            padding: MaterialStateProperty.all(
              EdgeInsets.symmetric(
                horizontal: isMobile ? 12 : 16,
                vertical: isMobile ? 8 : 12,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

////////////////////////////////HOME PAGE////////////////////////////////////////////////////

class MyPortfolioHome extends StatefulWidget {
  @override
  State<MyPortfolioHome> createState() => _MyPortfolioHomeState();
}

class _MyPortfolioHomeState extends State<MyPortfolioHome>
    with SingleTickerProviderStateMixin {
  final homeKey = GlobalKey();
  final portfolioKey = GlobalKey();
  final worksKey = GlobalKey();
  final aboutKey = GlobalKey();
  final contactKey = GlobalKey();
  late AnimationController _controller;
  late Animation<double> _borderWidthAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();

    _borderWidthAnimation = Tween<double>(
      begin: 2.0,
      end: 6.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void scrollTo(GlobalKey key) {
    final ctx = key.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(
        ctx,
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    }
  }

  Map<GlobalKey, bool> _isHovering = {};
  Map<GlobalKey, bool> _isPressing = {};

  Widget _navButton(String label, GlobalKey key) {
    _isHovering.putIfAbsent(key, () => false);
    _isPressing.putIfAbsent(key, () => false);

    double scale = _isPressing[key]! ? 0.95 : (_isHovering[key]! ? 1.1 : 1.0);

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovering[key] = true),
      onExit: (_) => setState(() => _isHovering[key] = false),
      child: GestureDetector(
        onTap: () => scrollTo(key),
        onTapDown: (_) => setState(() => _isPressing[key] = true),
        onTapUp: (_) => setState(() => _isPressing[key] = false),
        onTapCancel: () => setState(() => _isPressing[key] = false),
        child: AnimatedScale(
          scale: scale,
          duration: const Duration(milliseconds: 100),
          child: AnimatedContainer(
            padding: EdgeInsets.only(bottom: _isHovering[key]! ? 6 : 2),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: _isHovering[key]!
                      ? Colors.indigo.shade900
                      : Colors.transparent,
                  width: 2,
                ),
              ),
            ),
            duration: const Duration(milliseconds: 150),
            child: Text(label, style: TextStyle(color: Colors.white)),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.of(context).size.width;
    final isMobile = w < 600;

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text(
          'Stephy RN',
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 18 : 20,
          ),
        ),
        actions: isMobile
            ? null
            : [
                _navButton('Home', homeKey),
                SizedBox(width: 12),
                _navButton('Portfolio', portfolioKey),
                SizedBox(width: 12),
                _navButton('Works', worksKey),
                SizedBox(width: 12),
                _navButton('About', aboutKey),
                SizedBox(width: 12),
                ElevatedButton(
                  onPressed: () => scrollTo(contactKey),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.indigo.shade900,
                  ),
                  child: Text(
                    'Contact Me',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                SizedBox(width: 12),
              ],
      ),
      drawer: isMobile
          ? Drawer(
              backgroundColor: Colors.grey[900],
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  DrawerHeader(
                    decoration: BoxDecoration(
                      color: Colors.indigo.shade900,
                    ),
                    child: Text(
                      'Navigation',
                      style: TextStyle(color: Colors.white, fontSize: 24),
                    ),
                  ),
                  _drawerItem('Home', homeKey),
                  _drawerItem('Portfolio', portfolioKey),
                  _drawerItem('Works', worksKey),
                  _drawerItem('About', aboutKey),
                  _drawerItem('Contact', contactKey),
                ],
              ),
            )
          : null,
      body: SingleChildScrollView(
        child: Column(
          children: [
            _responsiveHome(w),
            _responsivePortfolio(w),
            _worksSection(),
            _responsiveAbout(w),
            _contactSection(),
          ],
        ),
      ),
    );
  }

  Widget _drawerItem(String label, GlobalKey key) {
    return ListTile(
      title: Text(label, style: TextStyle(color: Colors.white)),
      onTap: () {
        Navigator.pop(context);
        scrollTo(key);
      },
    );
  }

  Widget _responsiveHome(double w) {
    final isMobile = w < 600;
    final isTablet = w >= 600 && w < 900;
    final maxImageSide = isMobile ? w * 0.6 : (isTablet ? w * 0.4 : w * 0.35);

    return Container(
      key: homeKey,
      padding: EdgeInsets.symmetric(
        vertical: isMobile ? 40 : 80,
        horizontal: w * 0.07,
      ),
      child: isMobile || isTablet
          ? Column(
              children: [
                _homeImage(maxImageSide),
                SizedBox(height: 30),
                _homeText(),
              ],
            )
          : Row(
              children: [
                Expanded(flex: 2, child: _homeText()),
                SizedBox(width: 20),
                Expanded(child: _homeImage(maxImageSide)),
              ],
            ),
    );
  }

  Widget _homeText() {
    final w = MediaQuery.of(context).size.width;
    final isMobile = w < 600;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        DefaultTextStyle(
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 22 : 30,
          ),
          child: AnimatedTextKit(
            animatedTexts: [
              TypewriterAnimatedText(
                'Hi,\nI\'m Stephy RN\nA Flutter Mobile Application Developer',
                speed: Duration(milliseconds: 100),
              ),
            ],
            totalRepeatCount: 1,
          ),
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: () => scrollTo(contactKey),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo.shade900,
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 16 : 20,
              vertical: isMobile ? 12 : 16,
            ),
          ),
          child: Text(
            'Get in Touch',
            style: TextStyle(
              color: Colors.white,
              fontSize: isMobile ? 14 : 16,
            ),
          ),
        ),
      ],
    );
  }

  Widget _homeImage(double maxSide) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: maxSide,
          maxHeight: maxSide,
        ),
        child: AnimatedBuilder(
          animation: Listenable.merge([_borderWidthAnimation]),
          builder: (context, child) {
            final borderWidth = _borderWidthAnimation.value;
            return OverflowBox(
              minWidth: 0,
              minHeight: 0,
              maxWidth: double.infinity,
              maxHeight: double.infinity,
              child: Container(
                width: maxSide,
                height: maxSide,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.indigo.shade900,
                    width: borderWidth,
                  ),
                ),
                child: ClipOval(
                  child: Image.asset(
                    "Assets/Images/stephyrn.jpg",
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _responsivePortfolio(double w) {
    final isMobile = w < 600;
    final isTablet = w >= 600 && w < 900;

    return Container(
      key: portfolioKey,
      color: Colors.black,
      constraints: BoxConstraints(minHeight: isMobile ? 300 : 600),
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 20,
        vertical: isMobile ? 30 : 60,
      ),
      child: isMobile
          ? Column(
              children: [
                _platformsContent(context),
                SizedBox(height: 20),
                Lottie.asset(
                  'Assets/Animation/openlaptop.json',
                  height: 250,
                  fit: BoxFit.contain,
                  repeat: true,
                  animate: true,
                ),
              ],
            )
          : Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Lottie.asset(
                    'Assets/Animation/openlaptop.json',
                    height: isTablet ? 500 : 700,
                    fit: BoxFit.contain,
                    repeat: true,
                    animate: true,
                  ),
                ),
                SizedBox(width: isTablet ? 20 : 40),
                Expanded(child: _platformsContent(context)),
              ],
            ),
    );
  }

  Widget buildCard(Map<String, dynamic> p, BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Card(
      color: Colors.grey[900],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProjectDetail(project: p),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: isMobile ? 100 : 120,
              width: double.infinity,
              child: Image.asset(p['image']!, fit: BoxFit.cover),
            ),
            Padding(
              padding: EdgeInsets.all(isMobile ? 12 : 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    p['title']!,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: isMobile ? 14 : 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    p['description']!,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: isMobile ? 12 : 13,
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _worksSection() {
    final w = MediaQuery.of(context).size.width;
    final isMobile = w < 600;
    final isTablet = w >= 600 && w < 900;

    final projects = [
      {
        'image': 'Assets/Images/wallflow/Login.jpg',
        'title': 'WallFlow',
        'description':
            'This project is a full-stack wallpaper application built using Flutter...',
        'fullDescription': 'This project is a full-stack wallpaper application built using Flutter for the frontend and Node.js with Express.js for the backend. It allows users to securely register and log in, explore different wallpaper categories, search for wallpapers, add them to favorites, and download or set them easily on their devices. The app uses RESTful APIs to connect the frontend and backend, ensuring smooth communication and efficient data management. With a responsive design and user-friendly interface, the application provides a simple and enjoyable wallpaper browsing experience.'
            '\n\nKey Features:'
            '\n• Secure user authentication system with login and registration functionality'
            '\n• Add wallpapers to favourites for quick access and personalized collections'
            '\n• Download and directly set wallpapers to the device with one-tap convenience'
            '\n• Advanced search functionality to browse, download, and set wallpapers across all categories (e.g., nature, abstract, landscapes, and more)'
            '\n• RESTful API Integration with Node.js backend for scalable data management'
            '\n• HTTP package integration for seamless communication between Flutter frontend and backend services'
            '\n• Responsive UI design with thorough testing for optimal performance across devices'
            '\n• Tech Stack: Flutter, Dart, Node.js, Express.js, REST APIs, HTTP Package',
        'screenshots': [
          'Assets/Images/wallflow/Login.jpg',
          'Assets/Images/wallflow/Register.jpg',
          'Assets/Images/wallflow/Home.jpg',
          'Assets/Images/wallflow/Drawer without pic.jpg',
          'Assets/Images/wallflow/Wishlist.jpg',
          'Assets/Images/wallflow/Wallpaper.jpg',
          'Assets/Images/wallflow/Set Wallpaper.jpg',
          'Assets/Images/wallflow/Download wallpaper.jpg',
          'Assets/Images/wallflow/Downloaded image.jpg',
          'Assets/Images/wallflow/Downloaded list.jpg',
          'Assets/Images/wallflow/Profile.jpg',
          'Assets/Images/wallflow/Set pic.jpg',
          'Assets/Images/wallflow/Edit name.jpg',
          'Assets/Images/wallflow/Edit image.jpg',
          'Assets/Images/wallflow/Drawer with pic.jpg',
          'Assets/Images/wallflow/Remove Image.jpg',
          'Assets/Images/wallflow/Removed pic.jpg',
        ],
        'conclusion':
            'This wallpaper application successfully combines a Flutter frontend with a Node.js backend to create a smooth and secure user experience. Users can register, log in, search for wallpapers, add them to favorites, download, and set them easily. The RESTful API allows seamless communication between the app and the server, ensuring fast and reliable data handling. With a responsive design and proper testing, the app performs well across different devices. Overall, the project demonstrates strong full-stack development skills and provides a scalable foundation for future improvements.',
      },
      {
        'image': 'Assets/Images/StudLogin.png',
        'title': 'Educk',
        'description':
            'Educk is a Flutter-based attendance and academic management system designed...',
        'fullDescription': 'Educk is a Flutter-based attendance and academic management system designed to simplify communication and data management between students and teachers. The application uses Firebase services to handle authentication, real-time database updates, and messaging. It allows users to track attendance, manage marks and academic records, and communicate instantly through a built-in chat system. With a clean and responsive design, Educk provides a smooth and user-friendly academic management experience.'
            '\n\nKey Features:'
            '\n• Role-based authentication with admin approval workflow for student and teacher registration'
            '\n• Real-time Chat facility enabling live communication between students and teachers, powered by WebSocket connections for instant messaging and notifications'
            '\n• Complete CRUD operations for managing academic data including marks, notes, timetables, and syllabuses'
            '\n• Swipe-based attendance marking system for intuitive user interaction'
            '\n• Profile management with customizable Dark theme support'
            '\n• BLoC state management for efficient handling of complex data states and real-time Firestore updates'
            '\n• JSON serialization for seamless data exchange and Firebase integration, ensuring efficient API payloads and offline syncing capabilities'
            '\n• Responsive UI design with thorough testing for optimal performance across devices'
            '\n• Tech Stack: Flutter, Dart, Firebase (Authentication, Firestore, Cloud Messaging), BLoC, WebSocket (via Firebase Realtime Database), JSON ',
        'screenshots': [
          'Assets/Images/stud/Login.jpg',
          'Assets/Images/stud/Home1.jpg',
          'Assets/Images/stud/Home2.jpg',
          'Assets/Images/stud/Forgot password.jpg',
          'Assets/Images/stud/Attendance.jpg',
          'Assets/Images/stud/Exam result.jpg',
          'Assets/Images/stud/Mark list.jpg',
          'Assets/Images/stud/Marklist details.jpg',
          'Assets/Images/stud/Syllabus.jpg',
          'Assets/Images/stud/Notes.jpg',
          'Assets/Images/stud/Online class.jpg',
          'Assets/Images/stud/Payment-paid.jpg',
          'Assets/Images/stud/Payment-pending.jpg',
          'Assets/Images/stud/Notifications.jpg',
          'Assets/Images/stud/Settings.jpg',
          'Assets/Images/stud/Profile.jpg',
        ],
        'conclusion':
            'Educk successfully combines Flutter and Firebase to create an efficient and reliable academic management system. With features like role-based authentication, real-time chat, attendance tracking, and complete academic data management, the app ensures smooth interaction between students and teachers. Its structured state management and responsive design make it scalable, maintainable, and suitable for real-world educational environments.',
      },
      {
        'image': 'Assets/Images/portfolio/Home.png',
        'title': 'Portfolio',
        'description':
            'Its My portfolio website is a sleek, professionally designed digital showcase...',
        'fullDescription': 'Its My portfolio website is a sleek, professionally designed digital showcase that presents the work and capabilities of a talented Flutter developer based in Thiruvananthapuram, Kerala, India. This modern portfolio serves as a comprehensive platform for potential clients, collaborators, and employers to explore Stephy\'s technical expertise, professional journey, and project accomplishments. With its minimalist black-themed interface and intuitive navigation, the website effectively communicates Stephy\'s identity as a versatile cross-platform developer specializing in Flutter, while also highlighting a unique background that bridges both software development and quality assurance. The portfolio demonstrates not only technical proficiency across multiple platforms—Android, iOS, Web, and Desktop—but also showcases a diverse skill set that includes programming languages like Dart and Kotlin, API integration, quality assurance methodologies, and front-end development technologies.'
            '\n\nKey Features'
            '\n• Modern & Minimalist Design – Sleek black-themed interface with a clean and professional layout.'
            '\n• Responsive Cross-Platform UI – Optimized for desktop, tablet, and mobile devices to ensure a smooth browsing experience.'
            '\n• About & Professional Summary Section – Highlights technical expertise, career journey, and specialization in Flutter development.'
            '\n• Projects Showcase – Displays detailed project descriptions with technologies used and key contributions.'
            '\n• Skills & Technology Stack Display – Clearly presents programming languages, frameworks, tools, and QA expertise.'
            '\n• Cross-Platform Development Focus – Emphasizes experience in building Android, iOS, Web, and Desktop applications using Flutter.'
            '\n• Tech Stack: Flutter, Dart, GitHub',
        'screenshots': [
          'Assets/Images/portfolio/splash.png',
          'Assets/Images/portfolio/Home.png',
          'Assets/Images/portfolio/portfolio.png',
          'Assets/Images/portfolio/work.png',
          'Assets/Images/portfolio/wallflow.png',
          'Assets/Images/portfolio/educk.png',
          'Assets/Images/portfolio/portfolioscreen.png',
          'Assets/Images/portfolio/kdch.png',
          'Assets/Images/portfolio/About.png',
          'Assets/Images/portfolio/contact.png',
        ],
        'conclusion':
            'This portfolio website stands as a testament to modern web design principles and professional self-presentation in the tech industry. By seamlessly integrating essential components—personal introduction, professional experience timeline, educational credentials, project showcase, technical skills overview, and accessible contact information—the portfolio provides visitors with a complete picture of Stephy\'s capabilities as a Associate Flutter Developer. The clean, professional aesthetic combined with strategic content organization makes it easy for potential collaborators to understand Stephy\'s value proposition and reach out for opportunities. With an impressive transition from Electronic Quality Controller at Aptara Learnings to Flutter Developer at Kefi Tech Solutions, along with specialized training from Luminar Technolab, the portfolio effectively communicates both technical competence and professional growth. This digital presence serves as an excellent foundation for career advancement, networking, and securing freelance opportunities in the competitive field of mobile and cross-platform application development.',
      },
      {
        'image': 'Assets/Images/HospitalManagement.jpg',
        'title': 'Kdc_Hospitals',
        'description':
            'KDCH is a comprehensive mobile hospital management application designed...',
        'fullDescription': 'KDCH is a comprehensive mobile hospital management application designed to bridge the gap between patients and healthcare services. This all-in-one platform empowers patients with seamless access to medical records, appointment scheduling, prescription management, and hospital services directly from their smartphones. By digitizing traditional hospital interactions, KDCH eliminates the need for physical visits for routine tasks, reduces waiting times, and provides patients with greater control over their healthcare journey. The application features an intuitive interface with secure login, personalized profiles, and easy navigation, making quality healthcare access.'
            '\n\nKey Features'
            '\n• Secure User Authentication – Safe login and registration system to protect patient information.'
            '\n• Personalized Patient Profiles – Manage personal details, medical history, and preferences in one place.'
            '\n• Online Appointment Scheduling – Book, reschedule, or cancel appointments directly through the app.'
            '\n• Digital Medical Records Access – View lab reports, diagnoses, and treatment history anytime.'
            '\n• Prescription Management – Access and track prescribed medications and dosage details digitally.'
            '\n• Notifications & Reminders – Get real-time alerts for appointments, prescriptions, and hospital updates.'
            '\n• Hospital Services Directory – Explore departments, doctors, and available medical services.'
            '\n• User-Friendly Interface – Simple, intuitive, and responsive design for smooth navigation.'
            '\n• Data Security & Privacy – Secure backend integration to ensure confidentiality of medical data.'
            '\n• Tech Stack: Flutter, Dart, Node.js, Express.js, Firebase Firestore, BLoC, GitHub',
        'screenshots': [
          'Assets/Images/kdch/splash.jpg',
          'Assets/Images/kdch/Login.jpg',
          'Assets/Images/kdch/Home1.jpg',
          'Assets/Images/kdch/Home2.jpg',
          'Assets/Images/kdch/appointments.jpg',
          'Assets/Images/kdch/Reschedule appointment.jpg',
          'Assets/Images/kdch/Active appointment.jpg',
          'Assets/Images/kdch/online medicine order.jpg',
          'Assets/Images/kdch/offline appointment.jpg',
          'Assets/Images/kdch/Active medicine.jpg',
          'Assets/Images/kdch/Emergency contact.jpg',
          'Assets/Images/kdch/medical report.jpg',
          'Assets/Images/kdch/Lab reports.jpg',
          'Assets/Images/kdch/Radiology.jpg',
          'Assets/Images/kdch/prescription.jpg',
          'Assets/Images/kdch/bills.jpg',
          'Assets/Images/kdch/Discharge.jpg',
          'Assets/Images/kdch/medicine delivery.jpg',
          'Assets/Images/kdch/checkups.jpg',
          'Assets/Images/kdch/forgot password.jpg',
          'Assets/Images/kdch/Notifications.jpg',
          'Assets/Images/kdch/settings.jpg',
          'Assets/Images/kdch/Radiology.jpg',
          'Assets/Images/kdch/Departments.jpg',
          'Assets/Images/kdch/profile.jpg',
        ],
        'conclusion':
            'The KDCH Hospital Management Application represents a significant step forward in digital healthcare delivery, offering a patient-centric approach that prioritizes convenience, accessibility, and comprehensive care management. By integrating essential features such as appointment booking, medical records access, medication tracking, online pharmacy services, and emergency contacts into a single platform, the app streamlines the entire healthcare experience. With its user-friendly design, secure data management, and extensive functionality covering everything from health check-up packages to bill payments, KDCH serves as a complete healthcare companion. This digital solution not only enhances patient engagement and satisfaction but also contributes to more efficient hospital operations, ultimately fostering better health outcomes and a stronger patient-provider relationship in the modern healthcare landscape.',
      },
    ];

    return Container(
      key: worksKey,
      color: Colors.black,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 16,
        vertical: isMobile ? 60 : 150,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Works & Projects',
            style: TextStyle(
              color: Colors.white,
              fontSize: isMobile ? 22 : 28,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: isMobile ? 20 : 40),
          LayoutBuilder(
            builder: (ctx, cons) {
              int count;
              if (isMobile) {
                count = 1;
              } else if (isTablet) {
                count = 2;
              } else {
                count = (cons.maxWidth ~/ 200).clamp(2, 4);
              }
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: count,
                  mainAxisSpacing: isMobile ? 12 : 20,
                  crossAxisSpacing: isMobile ? 12 : 20,
                  mainAxisExtent: isMobile ? 220 : 250,
                ),
                itemCount: projects.length,
                itemBuilder: (context, index) {
                  final p = projects[index];
                  return Center(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(maxWidth: 300),
                      child: HoverJumpCard(child: buildCard(p, context)),
                    ),
                  );
                },
              );
            },
          )
        ],
      ),
    );
  }

  Widget _responsiveAbout(double w) {
    final isMobile = w < 600;
    final isTablet = w >= 600 && w < 900;

    return Container(
      key: aboutKey,
      color: Colors.black,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 16,
        vertical: isMobile ? 50 : 100,
      ),
      child: Column(
        children: [
          Text(
            'About Me',
            style: TextStyle(
              color: Colors.white,
              fontSize: isMobile ? 24 : 30,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: isMobile ? 40 : 80),
          if (isMobile || isTablet)
            Column(
              children: [
                _experienceColumn(context),
                SizedBox(height: 30),
                Lottie.asset(
                  'Assets/Animation/LaptopAnime.json',
                  height: isMobile ? 200 : 300,
                  fit: BoxFit.contain,
                  repeat: true,
                  animate: true,
                ),
                SizedBox(height: 30),
                _educationColumn(context),
              ],
            )
          else
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(child: _experienceColumn(context)),
                Lottie.asset(
                  'Assets/Animation/LaptopAnime.json',
                  height: 400,
                  width: 500,
                  fit: BoxFit.contain,
                  repeat: true,
                  animate: true,
                ),
                Expanded(child: _educationColumn(context)),
              ],
            ),
        ],
      ),
    );
  }

  Widget _contactSection() {
    return LayoutBuilder(
      builder: (ctx, constraints) {
        final w = constraints.maxWidth;
        final isMobile = w < 600;
        final isWide = w > 800;

        return Container(
          key: contactKey,
          color: Colors.black,
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 12 : 16,
            vertical: isMobile ? 60 : 140,
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: 1000),
              child: isWide
                  ? Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(flex: 1, child: _contactDetails()),
                        SizedBox(width: 40),
                        Expanded(flex: 1, child: _ContactForm(isWide: isWide)),
                      ],
                    )
                  : Column(
                      children: [
                        _contactDetails(),
                        SizedBox(height: 40),
                        _ContactForm(isWide: isWide),
                      ],
                    ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _launchInstagramProfile(String username) async {
    final nativeUrl = Uri.parse('instagram://user?username=$username');
    final webUrl =
        Uri.parse('https://www.instagram.com/stephy_rn/?next=%2F&hl=en/');

    if (await canLaunchUrl(nativeUrl)) {
      await launchUrl(nativeUrl, mode: LaunchMode.externalApplication);
    } else if (await canLaunchUrl(webUrl)) {
      await launchUrl(webUrl, mode: LaunchMode.externalApplication);
    } else {
      debugPrint("Could not open Instagram profile");
    }
  }

  Future<void> _launchFacebookProfile(String username) async {
    final nativeUrl = Uri.parse('facebook://user?username=$username');
    final webUrl =
        Uri.parse('https://www.facebook.com/profile.php?id=100004198426815/');

    if (await canLaunchUrl(nativeUrl)) {
      await launchUrl(nativeUrl, mode: LaunchMode.externalApplication);
    } else if (await canLaunchUrl(webUrl)) {
      await launchUrl(webUrl, mode: LaunchMode.externalApplication);
    } else {
      debugPrint("Could not open Facebook profile");
    }
  }

  Future<void> _launchLinkedInProfile(String username) async {
    final nativeUrl = Uri.parse('Linkedin://user?username=$username');
    final webUrl = Uri.parse('https://www.linkedin.com/in/stephy-rn/');

    if (await canLaunchUrl(nativeUrl)) {
      await launchUrl(nativeUrl, mode: LaunchMode.externalApplication);
    } else if (await canLaunchUrl(webUrl)) {
      await launchUrl(webUrl, mode: LaunchMode.externalApplication);
    } else {
      debugPrint("Could not open Linked in profile");
    }
  }

  Widget _contactDetails() {
    final w = MediaQuery.of(context).size.width;
    final isMobile = w < 600;

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
        Text('📍 Location',
            style:
                TextStyle(color: Colors.white70, fontSize: isMobile ? 13 : 15)),
        Text(
          'Thiruvananthapuram, Kerala, India',
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 14 : 16),
        ),
        SizedBox(height: isMobile ? 12 : 16),
        Text('✉️ Email',
            style:
                TextStyle(color: Colors.white70, fontSize: isMobile ? 13 : 15)),
        Text(
          'mail2stephyrn.as@gmail.com',
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 14 : 16),
        ),
        SizedBox(height: isMobile ? 12 : 16),
        Text('📞 Phone',
            style:
                TextStyle(color: Colors.white70, fontSize: isMobile ? 13 : 15)),
        Text(
          '+91 7907761417',
          style: TextStyle(color: Colors.white, fontSize: isMobile ? 14 : 16),
        ),
        SizedBox(height: isMobile ? 16 : 24),
        Text(
          'Feel free to reach out for collaborations, freelance work, or just a friendly hello!',
          style: TextStyle(color: Colors.white70, fontSize: isMobile ? 13 : 15),
        ),
        SizedBox(height: 15),
        Row(
          children: [
            GestureDetector(
              onTap: () => _launchInstagramProfile('your_username'),
              child: Lottie.asset(
                'Assets/Animation/Instagram.json',
                width: isMobile ? 50 : 70,
                height: isMobile ? 50 : 70,
              ),
            ),
            SizedBox(width: 10),
            GestureDetector(
              onTap: () => _launchFacebookProfile('your_username'),
              child: Lottie.asset(
                'Assets/Animation/Facebook.json',
                width: isMobile ? 50 : 70,
                height: isMobile ? 50 : 70,
              ),
            ),
            SizedBox(width: 10),
            GestureDetector(
              onTap: () => _launchLinkedInProfile('your_username'),
              child: Lottie.asset(
                'Assets/Animation/Linkedin.json',
                width: isMobile ? 50 : 70,
                height: isMobile ? 50 : 70,
              ),
            ),
          ],
        )
      ],
    );
  }
}

class ProjectDetail extends StatelessWidget {
  final Map<String, dynamic> project;

  const ProjectDetail({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text(
          project['title']!,
          style: TextStyle(
            color: Colors.white,
            fontSize: isMobile ? 16 : 18,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(isMobile ? 12 : 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              project['fullDescription']!,
              style: TextStyle(
                color: Colors.white,
                fontSize: isMobile ? 14 : 16,
              ),
            ),
            SizedBox(height: isMobile ? 15 : 20),
            Text(
              'Conclusion:',
              style: TextStyle(
                color: Colors.white,
                fontSize: isMobile ? 16 : 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              project['conclusion']!,
              style: TextStyle(
                color: Colors.white70,
                fontSize: isMobile ? 13 : 14,
              ),
            ),
            SizedBox(height: isMobile ? 20 : 30),
            Text(
              'Screenshots:',
              style: TextStyle(
                color: Colors.white,
                fontSize: isMobile ? 18 : 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            LayoutBuilder(
              builder: (context, constraints) {
                final crossAxisCount = isMobile
                    ? 2
                    : (constraints.maxWidth / 120).floor().clamp(3, 6);
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossAxisCount,
                    childAspectRatio: 1.0,
                    mainAxisSpacing: 4,
                    crossAxisSpacing: 1,
                  ),
                  itemCount: project['screenshots'].length,
                  itemBuilder: (context, index) {
                    final imagePath = project['screenshots'][index];
                    return GestureDetector(
                      onTap: () => _showFullImage(context, imagePath),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border:
                              Border.all(color: Colors.grey[700]!, width: 1),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.asset(
                            imagePath,
                            fit: BoxFit.cover,
                            width: double.infinity,
                            height: double.infinity,
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showFullImage(BuildContext context, String imagePath) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => FullImageScreen(imagePath: imagePath),
      ),
    );
  }
}

class FullImageScreen extends StatelessWidget {
  final String imagePath;

  const FullImageScreen({super.key, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: InteractiveViewer(
          child: Image.asset(
            imagePath,
            fit: BoxFit.contain,
          ),
        ),
      ),
    );
  }
}
