import 'dart:async';

import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:jumping_dot/jumping_dot.dart';
import 'dart:html' as html;
import 'dart:ui_web' as ui_web;

import 'package:lottie/lottie.dart';

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

void downloadResumeWeb(String url, String filename) {
  final anchor = html.AnchorElement(href: url)
    ..download = filename
    ..target = 'blank';
  html.document.body!.append(anchor);
  anchor.click();
  anchor.remove();
}

Widget _platformsContent() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        'What I can do',
        style: TextStyle(color: Colors.white, fontSize: 32),
      ),
      SizedBox(height: 20),
      Text(
        'Platforms I Build For',
        style: TextStyle(color: Colors.white, fontSize: 25),
      ),
      SizedBox(height: 30),
      Wrap(
        spacing: 16,
        runSpacing: 16,
        children: [
          _platformButton(Icons.android, 'Android'),
          _platformButton(Icons.apple, 'iOS'),
          _platformButton(Icons.language, 'Web'),
          _platformButton(Icons.desktop_windows, 'Desktop'),
        ],
      ),
      SizedBox(height: 30),
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
          'Quality Analyst (QA)',
          'Manual Testing',
          'Selenium',
          'Firebase',
          'Core Java',
          'HTML',
          'American Association Quality Control (AAQC)',
          'Coding Conversion (CC)',
          'Docx Pre-editing',
          'XML Correction',
        ]
            .map((skill) => ElevatedButton(
          onPressed: () {},
          child: Text(skill),
        ))
            .toList(),
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
        Text('My Experience',
            style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
        SizedBox(height: 20),
        _experienceTile('Junior Flutter Developer', 'Kefi Tech Solutions Pvt Ltd • Jun 2025–Present'),
        SizedBox(height: 12),
        _experienceTile('Electronic Quality Controller', 'Aptara Learnings Pvt Ltd • Mar 2021–Jun 2025'),
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
          Text('Contact Me',
            style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
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




Widget _platformButton(IconData icon, String label) {
  return TextButton.icon(
    onPressed: () {},
    icon: Icon(icon, color: Colors.white),
    label: Text(label, style: TextStyle(color: Colors.white)),
    style: ButtonStyle(
      backgroundColor: MaterialStateProperty.all(Colors.indigo.shade900),
      foregroundColor: MaterialStateProperty.resolveWith(
            (states) =>
        states.contains(MaterialState.pressed) ? Colors.indigo : Colors.white,
      ),
      padding: MaterialStateProperty.all(
        EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    ),
  );
}

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

  Widget _navButton(String label, GlobalKey key) =>
      TextButton(
        onPressed: () => scrollTo(key),
        child: Text(label, style: TextStyle(color: Colors.white)),
      );

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
          _navButton('Portfolio', portfolioKey),
          _navButton('Works', worksKey),
          _navButton('About', aboutKey),
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
          child: Image.asset(
            '',
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }


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
            mainAxisExtent: 250, // reduce height from 300 to 250
          ),
          itemCount: projects.length,
          itemBuilder: (c, i) {
            final p = projects[i];
            return Center(
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: 300), // limit card width
                child: buildCard(p),
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

  Widget _contactDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Get in Touch', style: TextStyle(
            color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
        SizedBox(height: 24),
        // Your details...
        Text('📍 Location', style: TextStyle(color: Colors.white70)),
        Text('Thiruvananthapuram, Kerala, India',
            style: TextStyle(color: Colors.white)),
        SizedBox(height: 16),
        Text('✉️ Email', style: TextStyle(color: Colors.white70)),
        Text('ammustephy.as@gmail.com', style: TextStyle(color: Colors.white)),
        SizedBox(height: 16),
        Text('📞 Phone', style: TextStyle(color: Colors.white70)),
        Text('+91 7907761417', style: TextStyle(color: Colors.white)),
        SizedBox(height: 24),
        Text(
            'Feel free to reach out for collaborations, freelance work, or just a friendly hello!',
            style: TextStyle(color: Colors.white70)),
      ],
    );
  }
}

