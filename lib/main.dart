import 'dart:async';

import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:jumping_dot/jumping_dot.dart';
import 'dart:html' as html;
import 'dart:ui_web' as ui_web;

import 'package:lottie/lottie.dart';
import 'package:url_launcher/url_launcher.dart';

////////MAIN FUNCTION///////////////////////////////////////////////

void main() {
  usePathUrlStrategy(); // removes the '#'
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
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
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Waiting ',
                style: TextStyle(color: Colors.white, fontSize: 25, fontWeight: FontWeight.bold)),
            JumpingDots(numberOfDots: 3, color: Colors.white, radius: 8,
                animationDuration: Duration(milliseconds: 300),
                innerPadding: 4.0, verticalOffset: 8.0),
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

void downloadResumeWeb(String url, String filename) {
  final anchor = html.AnchorElement(href: url)
    ..download = filename
    ..target = 'blank';
  html.document.body!.append(anchor);
  anchor.click();
  anchor.remove();
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
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovering = true),
      onExit: (_) => setState(() => _isHovering = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.translationValues(0, _isHovering ? -6 : 0, 0),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            elevation: _isHovering ? 8 : 4,
          ),
          onPressed: () { /* handle click */ },
          child: Text(widget.label),
        ),
      ),
    );
  }
}

Widget _platformsContent() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      SizedBox(height: 30),
      Text(
        'What I can do',
        style: TextStyle(color: Colors.white, fontSize: 32),
      ),
      SizedBox(height: 20),
      Text(
        'Platforms I Build For',
        style: TextStyle(color: Colors.white, fontSize: 25),
      ),
      SizedBox(height: 20),
      Wrap(
        spacing: 16,
        runSpacing: 16,
        children: [
          _platformButton(icon: Icons.android, label: 'Android', onPressed: () { /* ... */ }),
          _platformButton(icon:Icons.apple, label: 'iOS',onPressed: () { /* ... */ }),
          _platformButton(icon:Icons.language, label: 'Web',onPressed: () { /* ... */ }),
          _platformButton(icon:Icons.desktop_windows, label: 'Desktop',onPressed: () { /* ... */ }),
        ],
      ),
      SizedBox(height: 40),
      Text(
        'My Skills',
        style: TextStyle(color: Colors.white, fontSize: 22),
      ),
      SizedBox(height: 30),
      Wrap(
        spacing: 15,
        runSpacing: 15,
        children: [
          'Flutter',
          'Dart',
          'Kotlin',
          'REST API',
          'Quality Analyst (QA)',
          'Manual Testing',
          'Selenium',
          'Firebase',
          'Core Java',
          'XML Correction',
          'HTML',
          'Coding Conversion (CC)',
          'American Association Quality Control (AAQC)',
        ].map((skill) {
          return _JumpingSkillButton(label: skill);
        }).toList(),
      ),
      SizedBox(height: 100,),
      Center(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.indigo.shade900, Colors.grey.shade700],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: ElevatedButton(
              onPressed: () =>downloadResumeWeb(
            'https://your.server.com/Stephy_CV.pdf',
            'Stephy_CV.pdf',
            ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Download My Resume',
                style: TextStyle(color: Colors.white), // Better contrast on gradient
              ),
            ),
          ),
      )
    ],
  );
}

Widget _experienceColumn() {
  return Center(
    child: Column(
      // crossAxisAlignment: CrossAxisAlignment.start,
      // mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Text('Experience',
            style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
        SizedBox(height: 20),
        _experienceTile('Junior Flutter Developer', 'Kefi Tech Solutions Pvt Ltd • Jun 2025–Present'),
        SizedBox(height: 12),
        _experienceTile('Electronic Quality Controller', 'Aptara Learnings Pvt Ltd • Mar 2021–Jun 2025'),
      ],
    ),
  );
}

Widget _experienceTile(String role, String org) {
  return Container(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.indigo.shade900, Colors.black],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ),
      borderRadius: BorderRadius.circular(8),
    ),
    padding: EdgeInsets.all(24),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(role,
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      SizedBox(height: 4),
      Text(org, style: TextStyle(color: Colors.white)),
    ]),
  );
}

Widget _educationColumn() {
  return Center(
    child: Column(
      // crossAxisAlignment: CrossAxisAlignment.start,
      // mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Text('Education',
            style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
        SizedBox(height: 20),
        _experienceTile('B.Tech. Computer Science & Engineering', 'Kerala University, CGPA: 7.0, 2021'),
        SizedBox(height: 12),
        _experienceTile('Flutter / Mobile Application Development', 'Luminar Technolab, 2024'),
      ],
    ),
  );
}


Widget _educationTile({
  required String title,
  required String subtitle,
}) {
  return Container(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.indigo.shade800, Colors.black],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ),
      borderRadius: BorderRadius.circular(8),
    ),
    padding: EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            color: Colors.white,
            fontSize: 17,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 4),
        Text(
          subtitle,
          style: TextStyle(
            color: Colors.white,
            fontSize: 15,
          ),
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
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // Text('Contact Me',
          //   style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
          //   textAlign: TextAlign.center,
          // ),
          SizedBox(height: 24),
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
          SizedBox(height: 24),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo.shade900,
              padding: EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            ),
            onPressed: _submit,
            child: Text('Send Message', style: TextStyle(fontSize: 18,color: Colors.white)),
          ),
        ],
      ),
    );
  }


  Widget _buildNameField() => TextFormField(
    style: TextStyle(color: Colors.white),
    decoration: _inputDecoration('Name'),
    validator: (v) => v == null || v.trim().isEmpty ? 'Enter your name' : null,
    onSaved: (v) => _name = v!.trim(),
    textInputAction: TextInputAction.next,
  );

  Widget _buildEmailField() => TextFormField(
    style: TextStyle(color: Colors.white),
    decoration: _inputDecoration('Email'),
    validator: (v) {
      if (v == null || v.trim().isEmpty) return 'Enter your email';
      if (!RegExp(r'^[\w-.]+@([\w-]+\.)+\w{2,4}$').hasMatch(v.trim())) return 'Enter a valid email';
      return null;
    },
    onSaved: (v) => _email = v!.trim(),
    keyboardType: TextInputType.emailAddress,
    textInputAction: TextInputAction.next,
  );

  Widget _buildMessageField() => TextFormField(
    style: TextStyle(color: Colors.white),
    decoration: _inputDecoration('Message'),
    validator: (v) => v == null || v.trim().isEmpty ? 'Enter a message' : null,
    onSaved: (v) => _message = v!.trim(),
    maxLines: 5,
    keyboardType: TextInputType.multiline,
  );

  InputDecoration _inputDecoration(String label) => InputDecoration(
    labelText: label,
    labelStyle: TextStyle(color: Colors.white70),
    filled: true,
    fillColor: Colors.grey[900],
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
    contentPadding: EdgeInsets.symmetric(vertical: 16, horizontal: 12),
  );

  void _submit() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      // TODO: connect to backend/email service.
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
    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.translationValues(0, _hover ? -8 : 0, 0),
        child: TextButton.icon(
          onPressed: widget.onPressed,
          icon: Icon(widget.icon, color: Colors.white),
          label: Text(widget.label, style: const TextStyle(color: Colors.white)),
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(Colors.indigo.shade900),
            padding: MaterialStateProperty.all(
              const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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

class _MyPortfolioHomeState extends State<MyPortfolioHome> {
  final homeKey = GlobalKey();
  final portfolioKey = GlobalKey();
  final worksKey = GlobalKey();
  final aboutKey = GlobalKey();
  final contactKey = GlobalKey();

  void scrollTo(GlobalKey key) {
    final ctx = key.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(
          ctx, duration: Duration(milliseconds: 500), curve: Curves.easeInOut);
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
                  color: _isHovering[key]! ? Colors.indigo.shade900 : Colors.transparent,
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
    final w = MediaQuery
        .of(context)
        .size
        .width;

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text('Stephy RN', style: TextStyle(color: Colors.white)),
        actions: [
          _navButton('Home', homeKey),
          SizedBox(width: 12,),
          _navButton('Portfolio', portfolioKey),
          SizedBox(width: 12,),
          _navButton('Works', worksKey),
          SizedBox(width: 12,),
          _navButton('About', aboutKey),
          SizedBox(width: 12,),
          ElevatedButton(
            onPressed: () => scrollTo(contactKey),
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.indigo.shade900),
            child: Text('Contact Me', style: TextStyle(color: Colors.white),),
          ),
        ],
      ),
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

  Widget _responsiveHome(double w) {
    final isWide = w >= 800;
    final maxImageSide = isWide ? w * 0.35 : w * 0.8; // control image size

    return Container(
      key: homeKey,
      padding: EdgeInsets.symmetric(vertical: isWide ? 80 : 80, horizontal: w * 0.07),
      child: isWide
          ? Row(
        children: [
          Expanded(flex: 2, child: _homeText()),
          SizedBox(width: 20),
          Expanded(child: _homeImage(maxImageSide)),
        ],
      )
          : Column(
        children: [
          _homeText(),
          SizedBox(height: 20),
          _homeImage(maxImageSide),
        ],
      ),
    );
  }


  Widget _homeText() =>
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DefaultTextStyle(
            style: TextStyle(color: Colors.white, fontSize: 30),
            child: AnimatedTextKit(
              animatedTexts: [
                TypewriterAnimatedText(
                  'Hi,\nI\'m Stephy RN\nA Flutter Developer',
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
                backgroundColor: Colors.indigo.shade900),
            child: Text('Get in Touch', style: TextStyle(color: Colors.white),),
          ),
        ],
      );

  Widget _homeImage(double maxSide) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: maxSide,
          maxHeight: maxSide,
        ),
        child: OverflowBox(
          minWidth: 0,
          minHeight: 0,
          maxWidth: double.infinity,
          maxHeight: double.infinity,
          child:
          Lottie.asset(
            'assets/animation/Blocks loading.json',
            height: 300,
            width: 300,
          )
        )
      ),
    );
  }


  //////////////////////PORTFOLIO SECTION////////////////////////////////////////

  Widget _responsivePortfolio(double w) {
    final isWide = w > 900;
    return Container(
      key: portfolioKey,
      color: Colors.black,
      constraints: BoxConstraints(minHeight: isWide ? 600 : 400),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: isWide ? 10 : 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Lottie.asset(
              'Assets/Animation/openlaptop.json', // ensure this path is correct
              height: 700,
              fit: BoxFit.contain,
              repeat: true,
              animate: true,
            ),
          ),
          const SizedBox(width: 40),
          Expanded(child: _platformsContent()),
        ],
      ),
    );
  }

  /////////////////////////WORKS & PROJECTS///////////////////////////////////////

  Widget buildCard(Map<String, String> p) {
    return Card(
      color: Colors.grey[900],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {},
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: 120,
              width: double.infinity,
              child: Image.asset(p['image']!, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(p['title']!, style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(
                    p['description']!,
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
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
    final projects = [
      {
        'image': 'Assets/Images/HospitalManagement.jpg',
        'title': 'Hospital Management',
        'description': 'A secure, unified platform that digitizes and centralizes hospital operations...'
      },
      {
        'image': 'Assets/Images/StudLogin.png',
        'title': 'StudentApp',
        'description': 'A secure, personalized portal enabling students to log in...'
      },
      {
        'image': 'Assets/Images/News.png',
        'title': 'NewsToday',
        'description': 'A personalized news aggregator delivering top headlines in real time...'
      },
      {
        'image': 'Assets/Images/Chat.png',
        'title': 'Chat App',
        'description': 'A secure, real‑time messaging platform with voice/video calling...'
      },
    ];

    return Container(
      key: worksKey,
      color: Colors.black,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 150),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Works & Projects',
            style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),
      LayoutBuilder(builder: (ctx, cons) {
        final count = (cons.maxWidth ~/ 200).clamp(1, 4);
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: count,
            mainAxisSpacing: 20,
            crossAxisSpacing: 20,
            mainAxisExtent: 250,
          ),
          itemCount: projects.length,
          itemBuilder: (context, index) {
            final p = projects[index];
            return Center(
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: 300),
                child: HoverJumpCard(child: buildCard(p)),
              ),
            );
          },
        );
      }
      )
        ],
      ),
    );
  }


//////////////////////////////////ABOUT ME SECTION///////////////////////////////////////////////


  Widget _responsiveAbout(double w) {
    final isWide = w > 600;
    return Container(
      key: aboutKey,
      color: Colors.black,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 100),
      child: Column(
        children: [
          Text('About Me', style: TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.bold)),
          const SizedBox(height: 80),
          if (isWide)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(child: _experienceColumn()),
                Lottie.asset('Assets/Animation/LaptopAnime.json',
                  height: 400,
                  width: 500,
                  fit: BoxFit.contain,
                  repeat: true,
                  animate: true,),
                // const SizedBox(width: 40),
                Expanded(child: _educationColumn()),
              ],
            )
          else
            Column(
              children: [
                _experienceColumn(),
                const SizedBox(height: 20),
                _educationColumn(),
              ],
            ),
        ],
      ),
    );
  }

////////////////////////////////CONTACT & GRT IN TOUCH SECTION////////////////////////////

  Widget _contactSection() {
    return LayoutBuilder(builder: (ctx, constraints) {
      final w = constraints.maxWidth;
      final isWide = w > 800;

      return Container(
        key: contactKey,
        color: Colors.black,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 140),
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
    });
  }

  Future<void> _launchInstagramProfile(String username) async {
    final nativeUrl = Uri.parse('instagram://user?username=$username');
    final webUrl    = Uri.parse('https://www.instagram.com/stephy_rn/?next=%2F&hl=en/');

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
    final webUrl    = Uri.parse('https://www.facebook.com/profile.php?id=100004198426815/');

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
    final webUrl    = Uri.parse('https://www.linkedin.com/in/stephy-rn/');

    if (await canLaunchUrl(nativeUrl)) {
      await launchUrl(nativeUrl, mode: LaunchMode.externalApplication);
    } else if (await canLaunchUrl(webUrl)) {
      await launchUrl(webUrl, mode: LaunchMode.externalApplication);
    } else {
      debugPrint("Could not open Linked in profile");
    }
  }

  Widget _contactDetails() {
    const igUsername = 'your_username';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Get in Touch', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
        SizedBox(height: 24),
        Text('📍 Location', style: TextStyle(color: Colors.white70)),
        Text('Thiruvananthapuram, Kerala, India', style: TextStyle(color: Colors.white)),
        SizedBox(height: 16),
        Text('✉️ Email', style: TextStyle(color: Colors.white70)),
        Text('ammustephy.as@gmail.com', style: TextStyle(color: Colors.white)),
        SizedBox(height: 16),
        Text('📞 Phone', style: TextStyle(color: Colors.white70)),
        Text('+91 7907761417', style: TextStyle(color: Colors.white)),
        SizedBox(height: 24),
        Text('Feel free to reach out for collaborations, freelance work, or just a friendly hello!',
          style: TextStyle(color: Colors.white70),
        ),
        SizedBox(height: 15),
        Row(
          children: [
            GestureDetector(
              onTap: () => _launchInstagramProfile('your_username'),
              child: Text.rich(
                TextSpan(
                  style: TextStyle(color: Colors.white70, fontSize: 16),
                  children: [
                    WidgetSpan(
                      alignment: PlaceholderAlignment.middle,
                      child: Lottie.asset('Assets/Animation/Instagram.json', width: 70, height: 70),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(width: 10),
            GestureDetector(
              onTap: () => _launchFacebookProfile('your_username'),
              child: Text.rich(
                TextSpan(
                  style: TextStyle(color: Colors.white70, fontSize: 16),
                  children: [
                    WidgetSpan(
                      alignment: PlaceholderAlignment.middle,
                      child: Lottie.asset('Assets/Animation/Facebook.json', width: 70, height: 70),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(width: 10),
            GestureDetector(
              onTap: () => _launchLinkedInProfile('your_username'),
              child: Text.rich(
                TextSpan(
                  style: TextStyle(color: Colors.white70, fontSize: 16),
                  children: [
                    WidgetSpan(
                      alignment: PlaceholderAlignment.middle,
                      child: Lottie.asset('Assets/Animation/Linkedin.json', width: 70, height: 70),
                    ),
                  ],
                ),
              ),
            ),
          ],
        )
      ],
    );
  }
}

