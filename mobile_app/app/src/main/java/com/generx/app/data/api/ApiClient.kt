package com.generx.app.data.api

import android.content.Context
import com.generx.app.data.AuthManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    // 172.25.21.11 is your computer's local IP address on the network
    private const val BASE_URL = "http://172.23.52.66:8000/"

    @Volatile
    private var instance: GeneRxApi? = null

    fun getApi(context: Context): GeneRxApi {
        return instance ?: synchronized(this) {
            val authManager = AuthManager(context)

            val authInterceptor = Interceptor { chain ->
                val requestBuilder = chain.request().newBuilder()
                authManager.getToken()?.let { token ->
                    requestBuilder.addHeader("Authorization", "Bearer $token")
                }
                chain.proceed(requestBuilder.build())
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(authInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build()

            val retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            retrofit.create(GeneRxApi::class.java).also { instance = it }
        }
    }
}
