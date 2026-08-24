package com.generx.app.data.api

import com.google.gson.annotations.SerializedName

data class TokenResponse(
    @SerializedName("access_token") val accessToken: String,
    @SerializedName("token_type") val tokenType: String
)

data class PredictionRequest(
    val gene: String,
    val mutation: String
)

data class PredictionResponse(
    val gene: String,
    val mutation: String,
    val pathogenicity: String,
    @SerializedName("clinical_summary") val clinicalSummary: String,
    @SerializedName("risk_level") val riskLevel: String,
    @SerializedName("sensitive_therapies") val sensitiveTherapies: List<String>,
    @SerializedName("resistant_therapies") val resistantTherapies: List<String>
)
