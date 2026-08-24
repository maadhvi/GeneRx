package com.generx.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.generx.app.data.AuthManager
import com.generx.app.ui.navigation.BottomNavigationBar
import com.generx.app.ui.navigation.Screen
import com.generx.app.ui.screens.DashboardScreen
import com.generx.app.ui.screens.LoginScreen
import com.generx.app.ui.screens.PredictionScreen
import com.generx.app.ui.theme.GeneRxTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GeneRxTheme {
                val navController = rememberNavController()
                val authManager = remember { AuthManager(this) }
                
                var startDestination by remember {
                    mutableStateOf(if (authManager.isLoggedIn()) Screen.Dashboard.route else "login")
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navBackStackEntry by navController.currentBackStackEntryAsState()
                    val currentRoute = navBackStackEntry?.destination?.route
                    
                    val showBottomNav = currentRoute in listOf(Screen.Dashboard.route, Screen.Prediction.route)

                    Scaffold(
                        bottomBar = {
                            if (showBottomNav) {
                                BottomNavigationBar(navController = navController)
                            }
                        }
                    ) { innerPadding ->
                        NavHost(
                            navController = navController,
                            startDestination = startDestination,
                            modifier = Modifier.padding(innerPadding)
                        ) {
                            composable("login") {
                                LoginScreen(
                                    onLoginSuccess = {
                                        navController.navigate(Screen.Dashboard.route) {
                                            popUpTo("login") { inclusive = true }
                                        }
                                    }
                                )
                            }
                            composable(Screen.Dashboard.route) {
                                DashboardScreen()
                            }
                            composable(Screen.Prediction.route) {
                                PredictionScreen()
                            }
                        }
                    }
                }
            }
        }
    }
}
