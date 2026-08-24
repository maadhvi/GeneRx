import os
base_dir = r"C:\Users\gmaad\OneDrive\Desktop\GeneRx\mobile_app"

def create_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

pkg = "app/src/main/java/com/generx/app"

# --- THEME ---
create_file(f"{pkg}/ui/theme/Color.kt", '''
package com.generx.app.ui.theme
import androidx.compose.ui.graphics.Color

val ArcticBlue = Color(0xFF0EA5E9)
val EmeraldGreen = Color(0xFF34D399)
val BackgroundDark = Color(0xFF0B1120)
val SurfaceGlass = Color(0x1AFFFFFF)
val BorderGlass = Color(0x33FFFFFF)
val TextPrimary = Color(0xFFFFFFFF)
val TextSecondary = Color(0xFF94A3B8)
val DangerRed = Color(0xFFEF4444)
''')

create_file(f"{pkg}/ui/theme/Theme.kt", '''
package com.generx.app.ui.theme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = ArcticBlue,
    secondary = EmeraldGreen,
    background = BackgroundDark,
    surface = SurfaceGlass,
    onPrimary = TextPrimary,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun GeneRxTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
''')

# --- NETWORK ---
create_file(f"{pkg}/network/RetrofitClient.kt", '''
package com.generx.app.network
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    // 10.0.2.2 points to localhost on Android Emulator
    private const val BASE_URL = "http://10.0.2.2:8000/api/"

    val instance: ApiService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        retrofit.create(ApiService::class.java)
    }
    
    var authToken: String? = null
}
''')

create_file(f"{pkg}/network/ApiService.kt", '''
package com.generx.app.network
import retrofit2.http.*

data class LoginRequest(val email: String, val password: String)
data class TokenResponse(val access_token: String, val token_type: String)

data class PredictionRequest(val gene: String, val mutation: String)
data class PredictionResponse(val risk_level: String, val pathogenicity: String, val clinical_summary: String)

data class HistoryItem(val id: Int, val tool_type: String = "Tool", val created_at: String)

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body req: LoginRequest): TokenResponse

    @POST("predict")
    suspend fun predict(
        @Header("Authorization") token: String, 
        @Body req: PredictionRequest
    ): PredictionResponse

    @GET("history/predictions")
    suspend fun getPredictions(@Header("Authorization") token: String): List<HistoryItem>
}
''')

# --- COMPONENTS ---
create_file(f"{pkg}/ui/components/GlassCard.kt", '''
package com.generx.app.ui.components
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.generx.app.ui.theme.*

@Composable
fun GlassCard(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .border(1.dp, BorderGlass, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent)
    ) {
        Column(
            modifier = Modifier
                .background(Brush.linearGradient(listOf(Color(0x22FFFFFF), Color(0x05FFFFFF))))
                .padding(20.dp),
            content = content
        )
    }
}
''')

print("Components and Network layers created.")
