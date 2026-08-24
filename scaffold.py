import os

base_dir = r"C:\Users\gmaad\OneDrive\Desktop\GeneRx\mobile_app"

def create_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# --- GRADLE FILES ---
create_file("build.gradle.kts", '''
plugins {
    id("com.android.application") version "8.1.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.0" apply false
}
''')

create_file("app/build.gradle.kts", '''
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.generx.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.generx.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.1" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    implementation("androidx.activity:activity-compose:1.8.0")
    implementation(platform("androidx.compose:compose-bom:2023.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.5")
    
    // Retrofit & Coroutines
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
''')

create_file("settings.gradle.kts", '''
rootProject.name = "GeneRxMobile"
include(":app")
''')

# --- ANDROID MANIFEST ---
create_file("app/src/main/AndroidManifest.xml", '''
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.generx.app">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="GeneRx.ai"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.GeneRxMobile"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.GeneRxMobile">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
''')

create_file("app/src/main/res/values/themes.xml", '''
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.GeneRxMobile" parent="android:Theme.Material.Light.NoActionBar" />
</resources>
''')

# --- KOTLIN CODE ---
pkg = "app/src/main/java/com/generx/app"

# MainActivity
create_file(f"{pkg}/MainActivity.kt", '''
package com.generx.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.generx.app.ui.theme.GeneRxTheme
import com.generx.app.navigation.AppNavGraph

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GeneRxTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = com.generx.app.ui.theme.BackgroundDark
                ) {
                    AppNavGraph()
                }
            }
        }
    }
}
''')

print("Basic scaffold created.")
