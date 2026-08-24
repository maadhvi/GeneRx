package com.generx.app.data.api

import retrofit2.http.Body
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface GeneRxApi {
    @FormUrlEncoded
    @POST("/api/token")
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): TokenResponse

    @POST("/api/predict")
    suspend fun predictMutation(
        @Body request: PredictionRequest
    ): PredictionResponse
}
