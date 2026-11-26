import 'package:flutter/material.dart';

import '../../../core/utils/responsive.dart';
import '../view_models/contact_view_model.dart';

/// Name, email and message fields. Validation and sending live in
/// [ContactViewModel]; this widget only owns the text fields.
class ContactForm extends StatefulWidget {
  final ContactViewModel viewModel;
  final bool isWide;

  const ContactForm({super.key, required this.viewModel, required this.isWide});

  @override
  State<ContactForm> createState() => _ContactFormState();
}

class _ContactFormState extends State<ContactForm> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _message = TextEditingController();

  ContactViewModel get _vm => widget.viewModel;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _message.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final result = await _vm.send(
      name: _name.text,
      email: _email.text,
      message: _message.text,
    );
    if (!mounted) return;
    final opened = result == ContactResult.emailAppOpened;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(opened
            ? 'Your email app is open. Press send there to reach me.'
            : 'Could not open an email app. Please write to ${_vm.email}.'),
        backgroundColor: opened ? Colors.indigo.shade900 : Colors.red.shade900,
      ),
    );
    if (opened) {
      _formKey.currentState!.reset();
      _name.clear();
      _email.clear();
      _message.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);

    final nameField = TextFormField(
      controller: _name,
      style: const TextStyle(color: Colors.white),
      decoration: _decoration('Name'),
      validator: _vm.validateName,
      textInputAction: TextInputAction.next,
    );
    final emailField = TextFormField(
      controller: _email,
      style: const TextStyle(color: Colors.white),
      decoration: _decoration('Email'),
      validator: _vm.validateEmail,
      keyboardType: TextInputType.emailAddress,
      textInputAction: TextInputAction.next,
    );

    return Form(
      key: _formKey,
      child: Column(
        children: [
          SizedBox(height: isMobile ? 16 : 24),
          if (widget.isWide)
            Row(
              children: [
                Expanded(child: nameField),
                const SizedBox(width: 20),
                Expanded(child: emailField),
              ],
            )
          else ...[
            nameField,
            const SizedBox(height: 20),
            emailField,
          ],
          const SizedBox(height: 20),
          TextFormField(
            controller: _message,
            style: const TextStyle(color: Colors.white),
            decoration: _decoration('Message'),
            validator: _vm.validateMessage,
            maxLines: 5,
            keyboardType: TextInputType.multiline,
          ),
          SizedBox(height: isMobile ? 16 : 24),
          ListenableBuilder(
            listenable: _vm,
            builder: (context, _) => ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.indigo.shade900,
                padding: EdgeInsets.symmetric(
                  vertical: isMobile ? 12 : 16,
                  horizontal: isMobile ? 20 : 24,
                ),
              ),
              onPressed: _vm.sending ? null : _submit,
              child: Text(
                'Send Message',
                style: TextStyle(
                    fontSize: isMobile ? 16 : 18, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _decoration(String label) => InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white70),
        filled: true,
        fillColor: Colors.grey[900],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        contentPadding:
            const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      );
}
