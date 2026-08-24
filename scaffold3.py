import os
base_dir = r"C:\Users\gmaad\OneDrive\Desktop\GeneRx\mobile_app"

def create_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

pkg = "app/src/main/java/com/generx/app"

# --- SCREENS ---
create_file(f"{pkg}/ui/screens/AuthScreen.kt", '''
package com.generx.app.ui.screens
import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import com.generx.app.network.*
import com.generx.app.ui.components.GlassCard
import com.generx.app.ui.theme.ArcticBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuthScreen(onLoginSuccess: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
            Text("GeneRx.ai", color = ArcticBlue, fontSize = 32.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(32.dp))
            
            GlassCard {
                Text("Secure Login", color = androidx.compose.ui.graphics.Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = email, onValueChange = { email = it },
                    label = { Text("Email", color = androidx.compose.ui.graphics.Color.Gray) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        textColor = androidx.compose.ui.graphics.Color.White,
                        focusedBorderColor = ArcticBlue
                    )
                )
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = password, onValueChange = { password = it },
                    label = { Text("Password", color = androidx.compose.ui.graphics.Color.Gray) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        textColor = androidx.compose.ui.graphics.Color.White,
                        focusedBorderColor = ArcticBlue
                    )
                )
                Spacer(modifier = Modifier.height(24.dp))
                
                AnimatedVisibility(visible = error.isNotEmpty()) {
                    Text(error, color = com.generx.app.ui.theme.DangerRed, modifier = Modifier.padding(bottom = 8.dp))
                }
                
                Button(
                    onClick = {
                        scope.launch {
                            loading = true
                            try {
                                val res = RetrofitClient.instance.login(LoginRequest(email, password))
                                RetrofitClient.authToken = "Bearer "
                                onLoginSuccess()
                            } catch (e: Exception) {
                                error = "Authentication failed. Try again."
                            }
                            loading = false
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ArcticBlue)
                ) {
                    if (loading) CircularProgressIndicator(color = androidx.compose.ui.graphics.Color.White)
                    else Text("Authenticate", fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color.Black)
                }
            }
        }
    }
}
''')

create_file(f"{pkg}/ui/screens/DashboardScreen.kt", '''
package com.generx.app.ui.screens
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import com.generx.app.ui.components.GlassCard
import com.generx.app.ui.theme.ArcticBlue
import com.generx.app.ui.theme.EmeraldGreen

@Composable
fun DashboardScreen(onNavigateToPrediction: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
        Text("Clinical Dashboard", color = androidx.compose.ui.graphics.Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text("System overview & activity", color = androidx.compose.ui.graphics.Color.Gray, fontSize = 14.sp)
        Spacer(modifier = Modifier.height(24.dp))
        
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            GlassCard(modifier = Modifier.weight(1f)) {
                Text("Total Scans", color = androidx.compose.ui.graphics.Color.Gray, fontSize = 12.sp)
                Text("1,284", color = androidx.compose.ui.graphics.Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
            GlassCard(modifier = Modifier.weight(1f)) {
                Text("Status", color = androidx.compose.ui.graphics.Color.Gray, fontSize = 12.sp)
                Text("Operational", color = EmeraldGreen, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = onNavigateToPrediction,
            modifier = Modifier.fillMaxWidth().height(55.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ArcticBlue)
        ) {
            Text("Run New Mutation Prediction", fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color.Black)
        }
    }
}
''')

create_file(f"{pkg}/ui/screens/PredictionScreen.kt", '''
package com.generx.app.ui.screens
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import com.generx.app.network.*
import com.generx.app.ui.components.GlassCard
import com.generx.app.ui.theme.ArcticBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PredictionScreen() {
    var gene by remember { mutableStateOf("") }
    var mutation by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var result by remember { mutableStateOf<PredictionResponse?>(null) }
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
        Text("Mutation Prediction", color = androidx.compose.ui.graphics.Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(24.dp))
        
        GlassCard {
            OutlinedTextField(
                value = gene, onValueChange = { gene = it },
                label = { Text("Gene (e.g. BRAF)", color = androidx.compose.ui.graphics.Color.Gray) },
                modifier = Modifier.fillMaxWidth(),
                colors = TextFieldDefaults.outlinedTextFieldColors(textColor = androidx.compose.ui.graphics.Color.White)
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = mutation, onValueChange = { mutation = it },
                label = { Text("Mutation (e.g. V600E)", color = androidx.compose.ui.graphics.Color.Gray) },
                modifier = Modifier.fillMaxWidth(),
                colors = TextFieldDefaults.outlinedTextFieldColors(textColor = androidx.compose.ui.graphics.Color.White)
            )
            Spacer(modifier = Modifier.height(24.dp))
            
            Button(
                onClick = {
                    scope.launch {
                        loading = true
                        try {
                            result = RetrofitClient.instance.predict(RetrofitClient.authToken!!, PredictionRequest(gene, mutation))
                        } catch (e: Exception) {
                            // Handle error
                        }
                        loading = false
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ArcticBlue)
            ) {
                if (loading) CircularProgressIndicator(color = androidx.compose.ui.graphics.Color.White)
                else Text("Run Analysis", fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color.Black)
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        AnimatedVisibility(visible = result != null) {
            GlassCard {
                Text("Analysis Result", color = ArcticBlue, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))
                Text("Risk Level: ", color = androidx.compose.ui.graphics.Color.White, fontSize = 16.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text("Summary: ", color = androidx.compose.ui.graphics.Color.Gray, fontSize = 14.sp)
            }
        }
    }
}
''')

# --- NAVIGATION ---
create_file(f"{pkg}/navigation/AppNavGraph.kt", '''
package com.generx.app.navigation
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.generx.app.ui.screens.AuthScreen
import com.generx.app.ui.screens.DashboardScreen
import com.generx.app.ui.screens.PredictionScreen

@Composable
fun AppNavGraph() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "auth") {
        composable("auth") {
            AuthScreen(onLoginSuccess = { navController.navigate("dashboard") { popUpTo("auth") { inclusive = true } } })
        }
        composable("dashboard") {
            DashboardScreen(onNavigateToPrediction = { navController.navigate("prediction") })
        }
        composable("prediction") {
            PredictionScreen()
        }
    }
}
''')

print("UI Screens and Navigation created successfully!")
