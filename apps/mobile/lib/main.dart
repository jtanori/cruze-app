import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(const ProviderScope(child: CruceApp()));
}

class CruceApp extends StatelessWidget {
  const CruceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cruce',
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFF071A31),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00E0A0),
          surface: Color(0xFF0E223F),
        ),
      ),
      home: const Scaffold(
        body: Center(child: Text('Cruce Mobile — scaffold ready')),
      ),
    );
  }
}
