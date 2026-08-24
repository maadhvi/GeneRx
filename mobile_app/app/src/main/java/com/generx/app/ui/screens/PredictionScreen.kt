package com.generx.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.generx.app.data.api.ApiClient
import com.generx.app.data.api.PredictionRequest
import com.generx.app.data.api.PredictionResponse
import com.generx.app.ui.components.GlassPanel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PredictionScreen() {
    val context = LocalContext.current
    val api = remember { ApiClient.getApi(context) }
    val scope = rememberCoroutineScope()

    var gene by remember { mutableStateOf("") }
    var mutation by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var result by remember { mutableStateOf<PredictionResponse?>(null) }
    var error by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        GlassPanel(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Prediction Engine", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text("Initialize genomic sequence analysis", color = MaterialTheme.colorScheme.onSurface, fontSize = 14.sp)
                
                Spacer(modifier = Modifier.height(24.dp))
                
                OutlinedTextField(
                    value = gene,
                    onValueChange = { gene = it },
                    label = { Text("Sequence ID / Gene (e.g. BRAF)") },
                    modifier = Modifier.fillMaxWidth()
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                OutlinedTextField(
                    value = mutation,
                    onValueChange = { mutation = it },
                    label = { Text("Variant / Mutation (e.g. V600E)") },
                    modifier = Modifier.fillMaxWidth()
                )
                
                Spacer(modifier = Modifier.height(24.dp))
                
                if (error != null) {
                    Text(error!!, color = MaterialTheme.colorScheme.tertiary, modifier = Modifier.padding(bottom = 8.dp))
                }
                
                Button(
                    onClick = {
                        if (gene.isBlank() || mutation.isBlank()) return@Button
                        isLoading = true
                        error = null
                        scope.launch {
                            try {
                                result = api.predictMutation(PredictionRequest(gene, mutation))
                            } catch (e: Exception) {
                                error = "Failed to run prediction: ${e.message}"
                            } finally {
                                isLoading = false
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(50.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(24.dp))
                    } else {
                        Text("Run Prediction", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        if (result != null) {
            GlassPanel(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Severity Report", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text("Risk Level:", color = MaterialTheme.colorScheme.onSurface)
                    Text(
                        text = result!!.riskLevel,
                        color = if (result!!.riskLevel == "Critical" || result!!.riskLevel == "High") 
                                MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.secondary,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text("Clinical Summary", fontWeight = FontWeight.Bold)
                    Text(result!!.clinicalSummary, color = MaterialTheme.colorScheme.onSurface)
                }
            }
        }
    }
}
