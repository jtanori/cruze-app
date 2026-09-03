import 'package:flutter/material.dart';

// Map web globals.css @theme tokens → Flutter ThemeData
// Brand: Cruze Mint #00E0A0, Midnight #071A31, Surface #0E223F, etc.
class AppTheme {
  static const midnight = Color(0xFF071A31);
  static const surface = Color(0xFF0E223F);
  static const surfaceElevated = Color(0xFF132B4A);
  static const border = Color(0xFF1F3A54);
  static const cruzeMint = Color(0xFF00E0A0);
  static const warning = Color(0xFFFFB020);
  static const danger = Color(0xFFFF4D4F);
  static const info = Color(0xFF38A7FF);

  static ThemeData dark() => ThemeData(
        scaffoldBackgroundColor: midnight,
        colorScheme: const ColorScheme.dark(primary: cruzeMint, surface: surface),
        useMaterial3: true,
      );
}
