package com.generx.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.generx.app.ui.components.GlassPanel

@Composable
fun DashboardScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Clinical Dashboard",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "System overview and recent analytical activity.",
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 14.sp
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            StatCard(
                title = "Total Scans",
                value = "124",
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Critical Findings",
                value = "12",
                valueColor = MaterialTheme.colorScheme.tertiary,
                modifier = Modifier.weight(1f)
            )
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        GlassPanel(modifier = Modifier.fillMaxWidth().weight(1f)) {
            Column(modifier = Modifier.padding(8.dp)) {
                Text("Recent Activity", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(16.dp))
                Text("No recent activity.", color = MaterialTheme.colorScheme.onSurface)
                // Here we would implement a LazyColumn of history items
            }
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    valueColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onBackground,
    modifier: Modifier = Modifier
) {
    GlassPanel(modifier = modifier) {
        Column(
            modifier = Modifier.padding(8.dp)
        ) {
            Text(title, color = MaterialTheme.colorScheme.onSurface, fontSize = 12.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, color = valueColor, fontSize = 24.sp, fontWeight = FontWeight.Bold)
        }
    }
}
