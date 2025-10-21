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
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Download Button
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.indigo.shade900, Colors.grey.shade700],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: ElevatedButton(
                onPressed: () => downloadResumeWeb(
                  'Assets/Resume/STEPHY R.N-Flutter.pdf',
                  'STEPHY R.N-Flutter.pdf',
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
                  'Download Resume',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
            SizedBox(width: 12), // Space between buttons
            // New: View Resume Button
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.indigo.shade800, Colors.grey.shade600],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: ElevatedButton(
                onPressed: () => viewResumeWeb('Assets/Resume/STEPHY R.N-Flutter.pdf'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'View Resume',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      )
    ],
  );
}
void viewResumeWeb(String url) {
  html.window.open(url, '_blank'); // Opens PDF in new browser tab with built-in viewer
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

class _MyPortfolioHomeState extends State<MyPortfolioHome> with SingleTickerProviderStateMixin {
  final homeKey = GlobalKey();
  final portfolioKey = GlobalKey();
  final worksKey = GlobalKey();
  final aboutKey = GlobalKey();
  final contactKey = GlobalKey();
  late AnimationController _controller;
  // late Animation<double> _rotationAnimation;
  late Animation<double> _borderWidthAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();

    // _rotationAnimation = Tween<double>(
    //   begin: 0.0,
    //   end: 2 * 3.14159,
    // ).animate(CurvedAnimation(
    //   parent: _controller,
    //   curve: Curves.linear,
    // ));

    // New: Pulsing border width animation (syncs with rotation cycle)
    _borderWidthAnimation = Tween<double>(
      begin: 2.0,
      end: 6.0, // Pulse from thin to thicker border
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut, // Smooth pulse
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
        child: AnimatedBuilder(
          animation: Listenable.merge([_borderWidthAnimation]), // Listen to both
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


  Widget buildCard(Map<String, dynamic> p, BuildContext context) { // Added context param
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
        'title': 'Kdc_Hospitals',
        'description': 'KDCH is a comprehensive mobile hospital management application designed to bridge...',
        'fullDescription': 'KDCH is a comprehensive mobile hospital management application designed to bridge the gap between patients and healthcare services. This all-in-one platform empowers patients with seamless access to medical records, appointment scheduling, prescription management, and hospital services directly from their smartphones. By digitizing traditional hospital interactions, KDCH eliminates the need for physical visits for routine tasks, reduces waiting times, and provides patients with greater control over their healthcare journey. The application features an intuitive interface with secure login, personalized profiles, and easy navigation, making quality healthcare access.',
        'screenshots': [
          'Assets/Images/kdch/splash.jpg', // Replace with actual paths
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
        'conclusion': 'The KDCH Hospital Management Application represents a significant step forward in digital healthcare delivery, offering a patient-centric approach that prioritizes convenience, accessibility, and comprehensive care management. By integrating essential features such as appointment booking, medical records access, medication tracking, online pharmacy services, and emergency contacts into a single platform, the app streamlines the entire healthcare experience. With its user-friendly design, secure data management, and extensive functionality covering everything from health check-up packages to bill payments, KDCH serves as a complete healthcare companion. This digital solution not only enhances patient engagement and satisfaction but also contributes to more efficient hospital operations, ultimately fostering better health outcomes and a stronger patient-provider relationship in the modern healthcare landscape.',
      },
      {
        'image': 'Assets/Images/StudLogin.png',
        'title': 'StudApp',
        'description': 'The Student Portal is a comprehensive educational management mobile application...',
        'fullDescription': 'The Student Portal is a comprehensive educational management mobile application designed to streamline academic life for students by providing centralized access to all essential educational resources and information. This digital platform serves as a one-stop solution for students to manage their academic journey, from tracking attendance and accessing exam results to participating in online classes and managing coursework. With its user-friendly interface and intuitive navigation, the Student Portal eliminates the need for multiple platforms and paperwork, enabling students to stay organized, informed, and engaged with their studies. The application offers personalized dashboards, real-time notifications, and easy access to study materials, making it an indispensable tool for modern learners seeking to enhance their academic performance and stay connected with their educational institution.',
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
        'conclusion': 'The Student Portal Application represents a significant advancement in educational technology, offering students a powerful digital companion that simplifies and enhances their academic experience. By consolidating essential features such as attendance tracking, exam result viewing, marklist management, syllabus access, online classroom participation, study notes, payment management, and real-time notifications into a single, cohesive platform, the application empowers students to take control of their educational journey. The seamless integration of academic records, live class participation, and administrative functions not only improves efficiency but also fosters better communication between students and educational institutions. With its secure authentication, comprehensive profile management, and organized presentation of academic data, the Student Portal serves as an essential tool for modern education, promoting transparency, accessibility, and student success in an increasingly digital learning environment.',
      },
      {
        'image': 'Assets/Images/portfoliopic.png',
        'title': 'Portfolio',
        'description': 'Its My portfolio website is a sleek, professionally designed digital showcase that...',
        'fullDescription': 'Its My portfolio website is a sleek, professionally designed digital showcase that presents the work and capabilities of a talented Flutter developer based in Thiruvananthapuram, Kerala, India. This modern portfolio serves as a comprehensive platform for potential clients, collaborators, and employers to explore Stephy\'s technical expertise, professional journey, and project accomplishments. With its minimalist black-themed interface and intuitive navigation, the website effectively communicates Stephy\'s identity as a versatile cross-platform developer specializing in Flutter, while also highlighting a unique background that bridges both software development and quality assurance. The portfolio demonstrates not only technical proficiency across multiple platforms—Android, iOS, Web, and Desktop—but also showcases a diverse skill set that includes programming languages like Dart and Kotlin, API integration, quality assurance methodologies, and front-end development technologies.',
        'screenshots': [
          'Assets/Images/portfolio/splash.png',
          'Assets/Images/portfolio/Home.png',
          'Assets/Images/portfolio/portfolio.png',
          'Assets/Images/portfolio/work.png',
          'Assets/Images/portfolio/About.png',
          'Assets/Images/portfolio/contact.png',
        ],
        'conclusion': 'This portfolio website stands as a testament to modern web design principles and professional self-presentation in the tech industry. By seamlessly integrating essential components—personal introduction, professional experience timeline, educational credentials, project showcase, technical skills overview, and accessible contact information—the portfolio provides visitors with a complete picture of Stephy\'s capabilities as a Junior Flutter Developer. The clean, professional aesthetic combined with strategic content organization makes it easy for potential collaborators to understand Stephy\'s value proposition and reach out for opportunities. With an impressive transition from Electronic Quality Controller at Aptara Learnings to Flutter Developer at Kefi Tech Solutions, along with specialized training from Luminar Technolab, the portfolio effectively communicates both technical competence and professional growth. This digital presence serves as an excellent foundation for career advancement, networking, and securing freelance opportunities in the competitive field of mobile and cross-platform application development.',
      },
      {
        'image': 'Assets/Images/News.png',
        'title': 'NewsToday',
        'description': 'News Today is a modern, user-friendly news aggregation mobile application...',
        'fullDescription': 'News Today is a modern, user-friendly news aggregation mobile application designed to deliver real-time news content from around the world directly to users\' fingertips. Built with integration to a real news API, this application provides seamless access to current events and breaking news across multiple categories including Business, Entertainment, General, Health, and Science. The clean, minimalist interface features an elegant purple and white color scheme that enhances readability while maintaining a professional aesthetic. With its intuitive navigation system consisting of Home, Category, and Search functionalities accessible through a bottom navigation bar, News Today ensures users can effortlessly browse, filter, and discover news stories that matter to them. The application\'s splash screen, featuring the "NEWS TODAY" branding with a distinctive newspaper icon, sets the tone for a focused and reliable news consumption experience.',
        'screenshots': [
          'Assets/Images/news/splash.png',
          'Assets/Images/news/home.png',
          'Assets/Images/news/categories.png',
          'Assets/Images/news/search.png',
        ],
        'conclusion': 'News Today stands as a comprehensive solution for modern news consumption, successfully bridging the gap between real-time global news sources and mobile users seeking convenient, categorized access to information. Through its integration with a real news API, the application ensures that users receive authentic, up-to-date content across diverse interest areas, from business updates to scientific breakthroughs. The thoughtfully designed user interface, with its organized category system and robust search functionality, empowers users to customize their news experience according to their preferences and interests. By combining reliable content delivery with intuitive navigation and a visually appealing design, News Today serves as an essential tool for staying informed in today\'s fast-paced information landscape, making quality journalism accessible to everyone, anytime and anywhere.',
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
                    child: HoverJumpCard(child: buildCard(p, context)), // Pass context
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


class ProjectDetail extends StatelessWidget {
  final Map<String, dynamic> project;

  const ProjectDetail({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text(
          project['title']!,
          style: const TextStyle(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Full description
            Text(
              project['fullDescription']!,
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
            const SizedBox(height: 20),
            // Conclusion
            Text(
              'Conclusion:',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              project['conclusion']!,
              style: const TextStyle(color: Colors.white70, fontSize: 14),
            ),
            const SizedBox(height: 30),
            // Screenshots section
            const Text(
              'Screenshots:',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            // Grid of screenshots: 6 per row, reduced size, spaced
            LayoutBuilder(
              builder: (context, constraints) {
                // Adjust crossAxisCount based on screen width for responsiveness (aim for ~6)
                final crossAxisCount = (constraints.maxWidth / 120).floor().clamp(1, 6);
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossAxisCount,
                    childAspectRatio: 1.0, // Added for consistent square sizing; adjust if needed
                    mainAxisSpacing: 4, // Reduced vertical spacing between rows
                    crossAxisSpacing: 1, // Reduced horizontal spacing between columns
                  ),
                  itemCount: project['screenshots'].length,
                  itemBuilder: (context, index) {
                    final imagePath = project['screenshots'][index];
                    return GestureDetector(
                      onTap: () => _showFullImage(context, imagePath),
                      child: Container(
                        // Removed fixed height/width; let grid handle sizing for better fit
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey[700]!, width: 1),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.asset(
                            imagePath,
                            fit: BoxFit.cover, // Back to cover for full fill; use contain if letterbox preferred
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

// FullImageScreen remains unchanged
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
            fit: BoxFit.contain, // Full image visible, scalable
          ),
        ),
      ),
    );
  }
}



