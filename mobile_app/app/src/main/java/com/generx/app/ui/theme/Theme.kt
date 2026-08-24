package com.generx.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = Arctic,
    secondary = Emerald,
    tertiary = Pathogenic,
    background = Obsidian,
    surface = Surface,
    onPrimary = Obsidian,
    onSecondary = Obsidian,
    onTertiary = Obsidian,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun GeneRxTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
